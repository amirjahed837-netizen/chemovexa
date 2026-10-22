import * as THREE from "three";
import {
  CATEGORY_META,
  ORBITAL_COLORS,
  QUANTUM_ELEMENTS,
  type CategoryId,
  type MoleculeGeom,
  type OrbitalL,
  type QuantumElement,
  type QuantumSubshell,
  type ViewMode,
} from "@/lib/chem/quantum-elements";

/* ------------------------------------------------------------------ */
/* public types                                                        */
/* ------------------------------------------------------------------ */

/** per-frame values — mutable, no scene rebuild needed */
export type LiveSettings = {
  orbitSpeed: number;
  autoRotate: boolean;
  spring: boolean;
  dragMode: "rotate" | "move";
};

/** structural settings — trigger targeted rebuilds */
export type SceneFilter = {
  viewMode: ViewMode;
  orbitalFilter: string;
  highlightedSubshell: string | null;
  orbitGyro: boolean;
  showTrails: boolean;
  orbitalScale: number;
};

type SceneOptions = {
  onSelectZ: (z: number) => void;
};

/* ------------------------------------------------------------------ */
/* geometry helpers                                                    */
/* ------------------------------------------------------------------ */

/** teardrop lobe mesh — base at origin, tip along +Y (Y_lm harmonic style) */
function createLobeMesh(length: number, width: number, hexColor: number, opacity = 0.42): THREE.Mesh {
  const geo = new THREE.SphereGeometry(1, 28, 22);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const normY = (y + 1) * 0.5; // 0 at base, 1 at tip
    const pinch = Math.sin(normY * Math.PI) * (0.45 + 0.55 * normY);
    pos.setXYZ(i, x * width * pinch, normY * length, z * width * pinch);
  }
  geo.computeVertexNormals();

  const mat = new THREE.MeshPhysicalMaterial({
    color: hexColor,
    emissive: hexColor,
    emissiveIntensity: 0.25,
    roughness: 0.2,
    metalness: 0.05,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  return new THREE.Mesh(geo, mat);
}

/** small rounded label sprite (orbital names, atom symbols) */
function createLabelSprite(text: string, hexColor = "#22d3ee", scaleSize = 1.1): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 160;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "rgba(5, 10, 24, 0.78)";
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(6, 6, 148, 52, 14);
    else ctx.rect(6, 6, 148, 52);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 80, 33);
  }

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      transparent: true,
      depthTest: false,
    }),
  );
  sprite.scale.set(scaleSize * 1.6, scaleSize * 0.65, 1);
  return sprite;
}

function clearGroup(group: THREE.Group): void {
  for (const child of [...group.children]) {
    disposeObject(child);
    group.remove(child);
  }
}

/* ------------------------------------------------------------------ */
/* QuantumScene                                                        */
/* ------------------------------------------------------------------ */

type ElectronRef = {
  mesh: THREE.Group;
  trail: THREE.Mesh;
  angleOffset: number;
  speed: number;
};

type MolNode = {
  mesh: THREE.Mesh;
  basePos: THREE.Vector3;
  vel: THREE.Vector3;
  isCenter: boolean;
};

type MolBond = { mesh: THREE.Mesh; idxA: number; idxB: number; lobe: THREE.Mesh | null };

export class QuantumScene {
  private container: HTMLDivElement;
  private opts: SceneOptions;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private raycaster = new THREE.Raycaster();
  private mouseNDC = new THREE.Vector2();

  private movableRoot = new THREE.Group();
  private atomGroup = new THREE.Group();
  private nucleusGroup = new THREE.Group();
  private orbitalsGroup = new THREE.Group();
  private shellsGroup = new THREE.Group();
  private moleculeGroup = new THREE.Group();
  private table3DGroup = new THREE.Group();
  private starField!: THREE.Points;

  private electronMeshes: ElectronRef[] = [];
  private lobeGroups: THREE.Group[] = [];
  private molNodes: MolNode[] = [];
  private molBonds: MolBond[] = [];
  private tableTiles = new Map<number, THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>>();

  private nucleonGeo = new THREE.SphereGeometry(0.5, 16, 12);
  private electronGeo = new THREE.SphereGeometry(0.5, 12, 10);
  private protonMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.35, metalness: 0.2 });
  private neutronMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.2 });
  private electronMat = new THREE.MeshStandardMaterial({
    color: 0x7dd3fc,
    emissive: 0x22d3ee,
    emissiveIntensity: 1.8,
    roughness: 0.3,
  });

  private rootRotation = { x: 0.3, y: 0.45 };
  private rootVelocity = { rotX: 0, rotY: 0 };
  private rootPosition = new THREE.Vector3(0, 0.25, 0);
  private cameraZoom = 18.5;

  private isPointerDown = false;
  private draggedAtomNode: MolNode | null = null;
  private dragPlane = new THREE.Plane();
  private dragIntersection = new THREE.Vector3();
  private prevPointer = { x: 0, y: 0 };
  private dragMode: "rotate" | "move" = "rotate";
  private lastX = 0;
  private lastY = 0;
  private activePointers = new Map<number, { x: number; y: number }>();
  private pinchMode = false;
  private lastPinchDist = 0;

  private filters: SceneFilter = {
    viewMode: "atom",
    orbitalFilter: "all",
    highlightedSubshell: null,
    orbitGyro: true,
    showTrails: true,
    orbitalScale: 1,
  };

  private live: LiveSettings = {
    orbitSpeed: 1,
    autoRotate: false,
    spring: true,
    dragMode: "rotate",
  };

  private element: QuantumElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private animHandle = 0;
  private disposed = false;

  constructor(container: HTMLDivElement, opts: SceneOptions) {
    this.container = container;
    this.opts = opts;

    const w = container.clientWidth || 640;
    const h = container.clientHeight || 460;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 500);
    this.camera.position.set(0, 0.3, this.cameraZoom);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    const isSmall = Math.min(window.innerWidth, window.innerHeight) < 640;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2));
    container.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const l1 = new THREE.PointLight(0x22d3ee, 1.9, 140, 0);
    l1.position.set(14, 16, 18);
    this.scene.add(l1);
    const l2 = new THREE.PointLight(0xe879f9, 1.4, 140, 0);
    l2.position.set(-15, -12, 14);
    this.scene.add(l2);
    const l3 = new THREE.PointLight(0xfbbf24, 1.0, 120, 0);
    l3.position.set(0, 18, -14);
    this.scene.add(l3);

    this.raycaster = new THREE.Raycaster();
    this.mouseNDC = new THREE.Vector2();

    this.setupStars();
    this.atomGroup.add(this.nucleusGroup, this.orbitalsGroup, this.shellsGroup);
    this.movableRoot.add(this.atomGroup);
    this.moleculeGroup.visible = false;
    this.movableRoot.add(this.moleculeGroup);
    this.scene.add(this.movableRoot);

    this.table3DGroup.visible = false;
    this.scene.add(this.table3DGroup);
    this.build3DTableMeshes();

    this.setupPointerControls();
    this.attachResize();
    this.onWindowResize();
    this.startLoop();
  }

  /* ---------------- lifecycle ---------------- */

  private setupStars(): void {
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(420 * 3);
    for (let i = 0; i < 420 * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 140;
      starPos[i + 1] = (Math.random() - 0.5) * 90;
      starPos[i + 2] = -18 - Math.random() * 70;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    this.starField = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.26, transparent: true, opacity: 0.5 }),
    );
    this.scene.add(this.starField);
  }

  private attachResize(): void {
    this.resizeObserver = new ResizeObserver(() => this.onWindowResize());
    this.resizeObserver.observe(this.container);
  }

  private onWindowResize(): void {
    if (this.disposed) return;
    const w = this.container.clientWidth || 640;
    const h = this.container.clientHeight || 460;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private startLoop(): void {
    this.animHandle = requestAnimationFrame(this.loop);
  }

  private loop = (now: number) => {
    if (this.disposed) return;
    this.animHandle = requestAnimationFrame(this.loop);
    this.tick(now);
  };

  private tick(now: number): void {
    const t = now * 0.001;
    const live = this.live;

    for (const item of this.electronMeshes) {
      item.mesh.rotation.z = item.angleOffset + t * item.speed * live.orbitSpeed;
    }

    if (this.nucleusGroup) {
      this.nucleusGroup.rotation.y = t * 0.4;
      const s = 1 + Math.sin(t * 2.4) * 0.025;
      this.nucleusGroup.scale.set(s, s, s);
    }
    this.lobeGroups.forEach((lobeGrp, idx) => {
      const pulse = 1 + Math.sin(t * 2.0 + idx) * 0.02;
      lobeGrp.scale.set(pulse, pulse, pulse);
    });

    if (!this.isPointerDown) {
      if (live.autoRotate) {
        this.rootRotation.y += 0.005;
      } else {
        this.rootRotation.y += this.rootVelocity.rotY;
        this.rootRotation.x = Math.max(
          -Math.PI * 0.95,
          Math.min(Math.PI * 0.95, this.rootRotation.x + this.rootVelocity.rotX),
        );
        this.rootVelocity.rotX *= 0.92;
        this.rootVelocity.rotY *= 0.92;
      }
    }

    this.movableRoot.rotation.x = this.rootRotation.x;
    this.movableRoot.rotation.y = this.rootRotation.y;
    this.movableRoot.position.lerp(this.rootPosition, 0.18);

    this.updateMoleculeBondsAndPhysics();

    this.camera.position.lerp(new THREE.Vector3(0, 0.25, this.cameraZoom), 0.14);
    this.camera.lookAt(0, 0.25, 0);

    if (this.starField) this.starField.rotation.y = t * 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.animHandle);
    this.resizeObserver?.disconnect();
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointercancel", this.onPointerUp);
    disposeObject(this.scene);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  /* ---------------- public API ---------------- */

  setLive(live: LiveSettings): void {
    this.live = live;
  }

  setFilters(f: SceneFilter): void {
    const structural =
      f.orbitalFilter !== this.filters.orbitalFilter ||
      f.highlightedSubshell !== this.filters.highlightedSubshell ||
      f.orbitGyro !== this.filters.orbitGyro ||
      f.showTrails !== this.filters.showTrails;
    const scaleChanged = f.orbitalScale !== this.filters.orbitalScale;
    const viewChanged = f.viewMode !== this.filters.viewMode;

    this.filters = { ...f };

    if (!this.element) return;
    if (structural) this.showElement(this.element);
    else if (scaleChanged) this.buildQuantumOrbitals(this.element);
    else if (viewChanged) this.applyViewMode();
  }

  showElement(el: QuantumElement): void {
    this.element = el;
    this.build3DAtomForElement(el);
    this.build3DMoleculeForElement(el);
    this.applyViewMode();
  }

  resetView(): void {
    this.rootPosition.set(0, 0.25, 0);
    this.rootRotation.x = 0.3;
    this.rootRotation.y = 0.45;
    this.rootVelocity.rotX = 0;
    this.rootVelocity.rotY = 0;
    this.cameraZoom = 18.5;
  }

  private applyViewMode(): void {
    const mode = this.filters.viewMode;
    this.atomGroup.visible = mode !== "molecule";
    this.moleculeGroup.visible = mode === "molecule";
    this.table3DGroup.visible = mode === "table3d";

    if (mode === "table3d") {
      const el = this.element;
      const tileMesh = el ? this.tableTiles.get(el.z) : undefined;
      if (tileMesh) {
        this.movableRoot.scale.set(0.35, 0.35, 0.35);
        this.rootPosition.set(tileMesh.position.x, tileMesh.position.y, 0.5);
      }
    } else {
      this.movableRoot.scale.set(1, 1, 1);
      this.rootPosition.set(0, 0.25, 0);
    }

    const el = this.element;
    this.tableTiles.forEach((m, zKey) => {
      m.material.emissiveIntensity = zKey === el?.z ? 0.68 : 0.12;
      m.position.z = zKey === el?.z ? -2.1 : -3.0;
    });
  }

  /* ---------------- pointer controls ---------------- */

  private setupPointerControls(): void {
    const dom = this.renderer.domElement;
    dom.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerUp);
    dom.addEventListener("wheel", this.onWheel, { passive: false });
    dom.addEventListener("contextmenu", (e) => e.preventDefault());
    dom.style.touchAction = "none";
    dom.style.cursor = "grab";
  }

  private onPointerDown = (e: PointerEvent) => {
    const dom = this.renderer.domElement;
    this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.activePointers.size >= 2) {
      this.draggedAtomNode = null;
      this.pinchMode = true;
      this.lastPinchDist = this.getPinchDist();
      return;
    }
    this.isPointerDown = true;
    this.dragMode = e.button === 2 || e.shiftKey ? "move" : "rotate";
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.rootVelocity.rotX = 0;
    this.rootVelocity.rotY = 0;
    dom.setPointerCapture(e.pointerId);
    dom.style.cursor = "grabbing";

    const rect = dom.getBoundingClientRect();
    this.mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouseNDC, this.camera);

    if (this.filters.viewMode === "molecule" && this.live.spring) {
      const nodeMeshes = this.molNodes.map((n) => n.mesh);
      const hits = this.raycaster.intersectObjects(nodeMeshes, false);
      if (hits.length > 0) {
        const node = this.molNodes.find((n) => n.mesh === hits[0].object);
        if (node) {
          this.draggedAtomNode = node;
          const localPoint = this.movableRoot.worldToLocal(hits[0].point.clone());
          this.dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), localPoint);
          return;
        }
      }
    }

    if (this.filters.viewMode === "table3d") {
      const tiles = Array.from(this.tableTiles.values());
      const hits = this.raycaster.intersectObjects(tiles, false);
      if (hits.length > 0) {
        const z = (hits[0].object.userData as { z?: number }).z;
        if (typeof z === "number") {
          this.opts.onSelectZ(z);
          this.isPointerDown = false;
          return;
        }
      }
    }
  };

  private getPinchDist(): number {
    const pts = Array.from(this.activePointers.values());
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  }

  private onPointerMove = (e: PointerEvent) => {
    if (this.activePointers.has(e.pointerId)) {
      this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }
    if (this.pinchMode) {
      if (this.activePointers.size >= 2) {
        const d = this.getPinchDist();
        if (this.lastPinchDist > 0 && d > 0) {
          this.cameraZoom = Math.max(7, Math.min(38, this.cameraZoom - (d - this.lastPinchDist) * 0.045));
        }
        this.lastPinchDist = d;
      }
      return;
    }
    if (!this.isPointerDown) return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    if (this.draggedAtomNode) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouseNDC, this.camera);
      const hitPoint = new THREE.Vector3();
      if (this.raycaster.ray.intersectPlane(this.dragPlane, hitPoint)) {
        const local = this.movableRoot.worldToLocal(hitPoint.clone());
        this.draggedAtomNode.basePos.copy(local);
        this.draggedAtomNode.vel.set(0, 0, 0);
      }
      return;
    }

    if (this.dragMode === "rotate") {
      this.rootRotation.y += dx * 0.008;
      this.rootRotation.x += dy * 0.008;
      this.rootRotation.x = Math.max(-Math.PI * 0.95, Math.min(Math.PI * 0.95, this.rootRotation.x));
      this.rootVelocity.rotY = dx * 0.0006;
      this.rootVelocity.rotX = dy * 0.0006;
    } else {
      this.rootPosition.x = Math.max(-14, Math.min(14, this.rootPosition.x + dx * 0.03));
      this.rootPosition.y = Math.max(-10, Math.min(10, this.rootPosition.y - dy * 0.03));
    }
  };

  private onPointerUp = (e: PointerEvent) => {
    this.activePointers.delete(e.pointerId);
    if (this.activePointers.size < 2) this.pinchMode = false;
    this.isPointerDown = this.activePointers.size > 0;
    this.draggedAtomNode = null;
    if (!this.disposed) this.renderer.domElement.style.cursor = "grab";
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.cameraZoom = Math.max(7, Math.min(38, this.cameraZoom + Math.sign(e.deltaY) * 0.9));
  };

  /* ---------------- builders: atom ---------------- */

  private build3DAtomForElement(el: QuantumElement): void {
    clearGroup(this.nucleusGroup);
    clearGroup(this.shellsGroup);
    clearGroup(this.orbitalsGroup);
    this.electronMeshes = [];
    this.lobeGroups = [];

    const nucleons = Math.min(el.z + el.neutrons, 64);
    const protonCount = Math.min(el.z, nucleons);
    for (let i = 0; i < nucleons; i++) {
      const mat = i < protonCount ? this.protonMat : this.neutronMat;
      const nucleon = new THREE.Mesh(this.nucleonGeo, mat);
      const y = nucleons > 1 ? 1 - (i / (nucleons - 1)) * 2 : 0;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * 2.399963;
      nucleon.position.set(Math.cos(theta) * rad * 0.85, y * 0.85, Math.sin(theta) * rad * 0.85);
      const s = 0.75 + ((i * 37) % 10) / 45;
      nucleon.scale.set(s, s, s);
      this.nucleusGroup.add(nucleon);
    }

    const rings = Math.min(el.shells.length, 5);
    for (let sIdx = 0; sIdx < rings; sIdx++) {
      const count = el.shells[sIdx];
      if (!count) continue;
      const radius = 1.75 + sIdx * 0.9;

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.012, 8, 96),
        new THREE.MeshBasicMaterial({
          color: SHELL_COLORS[sIdx % SHELL_COLORS.length],
          transparent: true,
          opacity: 0.3,
        }),
      );
      const tilt = this.filters.orbitGyro ? SHELL_TILTS[sIdx % SHELL_TILTS.length] : 0;
      ring.rotation.x = Math.PI / 2 + tilt;
      this.shellsGroup.add(ring);

      const holder = new THREE.Group();
      holder.rotation.x = Math.PI / 2 + tilt;
      this.shellsGroup.add(holder);

      const placed = Math.min(count, 18);
      for (let eIdx = 0; eIdx < placed; eIdx++) {
        const eGroup = new THREE.Group();
        const ball = new THREE.Mesh(this.electronGeo, this.electronMat);
        ball.scale.setScalar(0.28);
        ball.position.x = radius;
        eGroup.add(ball);

        const trailArc = (Math.PI * 2) / 5;
        const trail = new THREE.Mesh(
          new THREE.TorusGeometry(radius, 0.05, 6, 36, trailArc),
          new THREE.MeshBasicMaterial({
            color: SHELL_COLORS[sIdx % SHELL_COLORS.length],
            transparent: true,
            opacity: this.filters.showTrails ? 0.2 : 0,
          }),
        );
        trail.rotation.z = -trailArc / 2 - 0.18;
        eGroup.add(trail);

        holder.add(eGroup);
        this.electronMeshes.push({
          mesh: eGroup,
          trail,
          angleOffset: (eIdx / placed) * Math.PI * 2,
          speed: 0.45 - sIdx * 0.06,
        });
      }
    }

    this.buildQuantumOrbitals(el);
  }

  /* ---------------- builders: quantum orbitals ---------------- */

  private buildQuantumOrbitals(el: QuantumElement): void {
    clearGroup(this.orbitalsGroup);
    this.lobeGroups = [];
    if (this.filters.orbitalFilter === "none") return;

    const filterType = this.filters.orbitalFilter;
    const highlight = this.filters.highlightedSubshell;

    const activeSubs = el.subshells.filter(
      (sub) => (filterType === "all" || sub.l === filterType) && (!highlight || sub.label === highlight),
    );

    const latestByL = new Map<OrbitalL, QuantumSubshell>();
    for (const sub of activeSubs) {
      const prev = latestByL.get(sub.l);
      if (!prev || sub.n > prev.n) latestByL.set(sub.l, sub);
    }

    let subs = Array.from(latestByL.values());
    if (subs.length === 0) {
      const wantedL: OrbitalL = filterType === "all" ? "s" : (filterType as OrbitalL);
      let best: QuantumSubshell | undefined;
      for (const sub of el.subshells) {
        if (sub.l !== wantedL) continue;
        if (!best || sub.n > best.n) best = sub;
      }
      if (!best) return;
      subs = [{ ...best, e: 0 }];
    }

    for (const sub of subs) this.buildSubshellOrbital(sub, this.filters.orbitalScale, highlight === sub.label);
  }

  private buildSubshellOrbital(sub: QuantumSubshell, scale: number, isHighlighted: boolean): void {
    const l = sub.l;
    const baseR = (1.6 + sub.n * 0.55) * scale;
    const colorPos = ORBITAL_COLORS[l].pos;
    const colorNeg = ORBITAL_COLORS[l].neg;
    const grp = new THREE.Group();

    const lobeOpacity = isHighlighted ? 0.55 : 0.32;

    if (l === "s") {
      const sph = new THREE.Mesh(new THREE.SphereGeometry(baseR, 32, 24), this.orbitalMaterial(colorPos, lobeOpacity));
      grp.add(sph);
      const wire = new THREE.Mesh(
        new THREE.SphereGeometry(baseR, 16, 12),
        new THREE.MeshBasicMaterial({ color: colorPos, wireframe: true, transparent: true, opacity: 0.14 }),
      );
      grp.add(wire);
    } else if (l === "p") {
      const axes: Array<[THREE.Vector3, number]> = [
        [new THREE.Vector3(1, 0, 0), 1],
        [new THREE.Vector3(0, 1, 0), 2],
        [new THREE.Vector3(0, 0, 1), 3],
      ];
      for (const [axis, minE] of axes) {
        const op = sub.e >= minE ? lobeOpacity : 0.07;
        const holder = new THREE.Group();
        holder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
        const lobePos = createLobeMesh(baseR * 1.25, 0.62, colorPos, op);
        lobePos.position.y = baseR * 0.8;
        const lobeNeg = createLobeMesh(baseR * 1.25, 0.62, colorNeg, op);
        lobeNeg.rotation.z = Math.PI;
        lobeNeg.position.y = -baseR * 0.8;
        holder.add(lobePos, lobeNeg);
        grp.add(holder);
      }
    } else if (l === "d") {
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI + Math.PI / 4;
        const dir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
        const holder = new THREE.Group();
        holder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        const lobePos = createLobeMesh(baseR * 1.15, 0.6, colorPos, lobeOpacity);
        lobePos.position.y = baseR * 0.78;
        const lobeNeg = createLobeMesh(baseR * 1.15, 0.6, colorNeg, lobeOpacity);
        lobeNeg.position.y = -baseR * 0.8;
        holder.add(lobePos, lobeNeg);
        grp.add(holder);
      }
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(baseR * 0.62, baseR * 0.12, 12, 48),
        this.orbitalMaterial(colorNeg, lobeOpacity),
      );
      torus.rotation.x = Math.PI / 2;
      grp.add(torus);
    } else {
      const corners: number[][] = [
        [1, 1, 1],
        [1, 1, -1],
        [1, -1, 1],
        [1, -1, -1],
        [-1, 1, 1],
        [-1, 1, -1],
        [-1, -1, 1],
        [-1, -1, -1],
      ];
      for (const [cx, cy, cz] of corners) {
        const dir = new THREE.Vector3(cx, cy, cz).normalize();
        const lobe = createLobeMesh(baseR * 0.85, 0.55, cz > 0 ? colorPos : colorNeg, lobeOpacity);
        lobe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        lobe.position.copy(dir.clone().multiplyScalar(baseR * 0.55));
        grp.add(lobe);
      }
    }

    const labelText = sub.label + (isHighlighted ? " ◀" : "");
    const label = createLabelSprite(labelText, ORBITAL_COLORS[l].css, 1.05);
    label.position.set(0, baseR * (l === "s" ? 1.1 : 1.55), 0);
    grp.add(label);

    this.orbitalsGroup.add(grp);
    this.lobeGroups.push(grp);
  }

  private orbitalMaterial(hexColor: number, opacity: number): THREE.MeshPhysicalMaterial {
    return new THREE.MeshPhysicalMaterial({
      color: hexColor,
      emissive: hexColor,
      emissiveIntensity: 0.22,
      roughness: 0.2,
      metalness: 0.05,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }

  /* ---------------- builders: molecule ---------------- */

  private build3DMoleculeForElement(el: QuantumElement): void {
    clearGroup(this.moleculeGroup);
    this.molNodes = [];
    this.molBonds = [];

    const mol = el.mol;
    const bondLen = 3.8;
    const meta = CATEGORY_META[el.cat as CategoryId] ?? CATEGORY_META.nonmetal;
    const centerColor = parseInt(meta.hex.slice(1), 16);
    const ligandPalette = [0x38bdf8, 0xe879f9, 0xfbbf24, 0x34d399, 0xf43f5e, 0xa78bfa];
    const ligandCss = ["#38bdf8", "#e879f9", "#fbbf24", "#34d399", "#f43f5e", "#a78bfa"];
    const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).normalize();

    const dirSets: Record<MoleculeGeom, THREE.Vector3[]> = {
      diatomic: [v(1, 0, 0)],
      bent: [v(0.61, 0.79, 0), v(0.61, -0.79, 0)],
      linear3: [v(1, 0, 0), v(-1, 0, 0)],
      trigonal: [v(1, 0, 0), v(-0.5, 0.87, 0), v(-0.5, -0.87, 0)],
      pyramidal: [v(0.94, 0.34, 0), v(-0.47, 0.34, 0.59), v(-0.94, 0.34, -0.59)],
      square: [v(1, 0, 0), v(-1, 0, 0), v(0, 0, 1), v(0, 0, -1)],
      bipyramidal: [v(1, 0, 0), v(-0.5, 0, 0.87), v(-0.5, 0, -0.87), v(0, 1, 0), v(0, -1, 0)],
      octahedral: [v(1, 0, 0), v(-1, 0, 0), v(0, 1, 0), v(0, -1, 0), v(0, 0, 1), v(0, 0, -1)],
      tetrahedral: [v(1, 1, 1), v(-1, -1, 1), v(-1, 1, -1), v(1, -1, -1)],
    };

    const dirs = dirSets[mol.geom] ?? dirSets.tetrahedral;
    const centerRadius = 0.95;

    const centerMesh = new THREE.Mesh(
      new THREE.SphereGeometry(centerRadius, 28, 20),
      new THREE.MeshStandardMaterial({
        color: centerColor,
        emissive: centerColor,
        emissiveIntensity: 0.45,
        roughness: 0.25,
        metalness: 0.3,
      }),
    );
    this.moleculeGroup.add(centerMesh);
    const centerLabel = createLabelSprite(el.sym, meta.hex, 1.2);
    centerLabel.position.y = centerRadius + 0.75;
    this.moleculeGroup.add(centerLabel);
    this.molNodes.push({ mesh: centerMesh, basePos: new THREE.Vector3(), vel: new THREE.Vector3(), isCenter: true });

    const ligGeo = new THREE.SphereGeometry(0.62, 20, 16);
    const bondGeo = new THREE.CylinderGeometry(0.09, 0.09, 1, 10);
    const bondMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.3, metalness: 0.4 });

    dirs.forEach((dir, i) => {
      const ligandSym = mol.ligands[i] ?? "H";
      const ligHex = ligandPalette[i % ligandPalette.length];
      const ligand = new THREE.Mesh(
        ligGeo,
        new THREE.MeshStandardMaterial({
          color: ligHex,
          emissive: ligHex,
          emissiveIntensity: 0.3,
          roughness: 0.3,
          metalness: 0.2,
        }),
      );
      ligand.position.copy(dir.clone().multiplyScalar(bondLen));
      this.moleculeGroup.add(ligand);
      this.molNodes.push({ mesh: ligand, basePos: ligand.position.clone(), vel: new THREE.Vector3(), isCenter: false });

      const bond = new THREE.Mesh(bondGeo, bondMat);
      this.moleculeGroup.add(bond);
      this.molBonds.push({ mesh: bond, idxA: 0, idxB: this.molNodes.length - 1, lobe: null });

      const tag = createLabelSprite(ligandSym, ligandCss[i % ligandCss.length], 0.85);
      tag.position.copy(dir.clone().multiplyScalar(bondLen + 0.95));
      this.moleculeGroup.add(tag);
    });

    if (mol.geom === "pyramidal") {
      const lobe = createLobeMesh(1.9, 0.7, 0x94a3b8, 0.4);
      lobe.rotation.z = Math.PI;
      lobe.position.y = -centerRadius - 0.4;
      this.moleculeGroup.add(lobe);
    } else if (mol.geom === "bent") {
      for (const a of [Math.PI - 0.91, Math.PI + 0.91]) {
        const lobe = createLobeMesh(1.6, 0.65, 0x94a3b8, 0.32);
        lobe.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(Math.cos(a), Math.sin(a), 0),
        );
        lobe.position.set(Math.cos(a) * 1.4, Math.sin(a) * 1.4, 0);
        this.moleculeGroup.add(lobe);
      }
    }

    const formulaLabel = createLabelSprite(mol.formula, "#f8fafc", 1.6);
    formulaLabel.position.set(0, 4.3, 0);
    this.moleculeGroup.add(formulaLabel);
  }

  private updateMoleculeBondsAndPhysics(): void {
    if (!this.moleculeGroup.visible) return;
    const spring = this.live.spring;

    for (const node of this.molNodes) {
      if (node === this.draggedAtomNode) continue;
      if (spring) {
        const force = node.basePos.clone().sub(node.mesh.position).multiplyScalar(node.isCenter ? 0.06 : 0.09);
        node.vel.add(force);
      }
      node.vel.multiplyScalar(0.9);
      node.mesh.position.add(node.vel);
    }

    for (let i = 0; i < this.molNodes.length; i++) {
      for (let j = i + 1; j < this.molNodes.length; j++) {
        const a = this.molNodes[i].mesh.position;
        const b = this.molNodes[j].mesh.position;
        const delta = a.clone().sub(b);
        const dist = delta.length();
        const minD = 2.2;
        if (dist < minD && dist > 0.0001) {
          const push = delta.multiplyScalar(((minD - dist) / dist) * 0.12);
          a.add(push);
          b.sub(push);
        }
      }
    }

    for (const bond of this.molBonds) {
      const a = this.molNodes[bond.idxA].mesh.position;
      const b = this.molNodes[bond.idxB].mesh.position;
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const dir = b.clone().sub(a);
      const len = dir.length();
      bond.mesh.position.copy(mid);
      bond.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      bond.mesh.scale.set(1, len, 1);
    }
  }

  /* ---------------- builders: 3d table ---------------- */

  private build3DTableMeshes(): void {
    const tileGeo = new THREE.BoxGeometry(1.35, 1.35, 0.22);
    for (const el of QUANTUM_ELEMENTS) {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      const meta = CATEGORY_META[el.cat as CategoryId] ?? CATEGORY_META.nonmetal;
      if (ctx) {
        ctx.fillStyle = "rgba(4, 10, 26, 0.92)";
        ctx.fillRect(0, 0, 128, 128);
        ctx.strokeStyle = meta.border;
        ctx.lineWidth = 5;
        ctx.strokeRect(4, 4, 120, 120);

        ctx.fillStyle = meta.hex;
        ctx.font = "bold 20px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillText(String(el.z), 12, 30);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 46px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(el.sym, 64, 82);

        ctx.fillStyle = meta.hex;
        ctx.font = "16px 'JetBrains Mono', monospace";
        ctx.fillText(el.mass.toFixed(1), 64, 112);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        color: 0xffffff,
        emissive: new THREE.Color(meta.hex),
        emissiveIntensity: 0.12,
        roughness: 0.55,
        metalness: 0.1,
      });
      const tile = new THREE.Mesh(tileGeo, mat);
      tile.position.set((el.col - 9.5) * 1.55, (5.5 - el.row) * 1.55, -3);
      tile.userData = { z: el.z };
      this.table3DGroup.add(tile);
      this.tableTiles.set(el.z, tile);
    }
  }
}

function disposeObject(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = (mesh as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else if (mat) mat.dispose();
  });
}

const SHELL_COLORS = [0x22d3ee, 0xe879f9, 0xfbbf24, 0x34d399, 0x818cf8, 0xf97316, 0x14b8a6];
const SHELL_TILTS = [0, 0.5, -0.5, 1.0, -1.0, 1.5];
