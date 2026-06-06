/**
 * Phantom Portfolio Gallery - Three.js Implementation
 * WordPress Plugin Version
 */

(function($) {
    'use strict';

    // Function to initialize when Three.js is ready
    function initPhantomGallery() {
        // Check for Three.js
        if (typeof THREE === 'undefined') {
            console.error('Phantom Portfolio: Three.js library not loaded');
            
            // Show error to user
            var loading = document.getElementById('phantom-loading');
            if (loading) {
                loading.innerHTML = '<div class="phantom-loading-text">ERROR: Three.js library failed to load</div>' +
                    '<div class="phantom-loading-text" style="font-size: 10px; margin-top: 10px;">Please refresh the page or contact support</div>';
            }
            return;
        }

        // Get configuration from WordPress
        const wpConfig = window.phantomPortfolioConfig || {};
        const wpProjects = window.phantomPortfolioProjects || [];
        const settings = wpConfig.settings || {};

        // Check if WordPress data is available
        if (!window.phantomPortfolioConfig) {
            console.warn('Phantom Portfolio: WordPress configuration not found');
        }

        if (!window.phantomPortfolioProjects) {
            console.warn('Phantom Portfolio: WordPress projects data not found');
        }

        // Convert WordPress projects to gallery format
        const projects = wpProjects.map(function(project) {
            // Use first image as main image, rest as gallery
            const mainImage = project.images[0] ? project.images[0].thumb : '';
            const images = project.images.map(img => img.full || img.thumb);
            
            return {
                id: project.id,
                title: project.title,
                description: project.description,
                client: project.client,
                url: project.url,
                date: project.date,
                permalink: project.permalink,
                mainImage: mainImage,
                images: images
            };
        });

        if (projects.length === 0) {
            console.warn('Phantom Portfolio: No projects found');
            var loading = document.getElementById('phantom-loading');
            if (loading) {
                loading.innerHTML = '<div class="phantom-loading-text">No portfolio items found</div>' +
                    '<div class="phantom-loading-text" style="font-size: 10px; margin-top: 10px;">Please add portfolio items in WordPress admin</div>';
            }
            return;
        }

    // GLSL Shaders
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform vec2 uOffset;
        uniform vec2 uResolution;
        uniform vec4 uBorderColor;
        uniform vec4 uBackgroundColor;
        uniform vec2 uMousePos;
        uniform float uZoom;
        uniform float uCellSize;
        uniform float uTextureCount;
        uniform sampler2D uImageAtlas;
        uniform float uHoverAnimations[256];
        uniform float uTime;
        uniform float uColumnsPerRow;
        uniform float uSphereStrength;
        varying vec2 vUv;
        
        float easeInOutCubic(float t) {
            return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
        }
        
        float properMod(float x, float y) {
            return mod(mod(x, y) + y, y);
        }
        
        void main() {
            vec2 screenUV = (vUv - 0.5) * 2.0;
            
            float radius = length(screenUV);
            float horizontalDist = abs(screenUV.x);
            float verticalDist = abs(screenUV.y);
            
            float sphereStrength = uSphereStrength;
            float horizontalFold = 1.0 - sphereStrength * verticalDist * verticalDist;
            float verticalFold = 1.0 - sphereStrength * horizontalDist * horizontalDist;
            
            vec2 distortedUV = screenUV;
            distortedUV.x *= verticalFold;
            distortedUV.y *= horizontalFold;
            
            float sphericalCurve = 1.0 + 0.15 * (1.0 - radius * 0.5);
            distortedUV *= sphericalCurve;
            
            vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.0);
            vec2 worldCoord = distortedUV * aspectRatio * uZoom + uOffset;
            vec2 cellPos = worldCoord / uCellSize;
            vec2 cellId = floor(cellPos);
            vec2 cellUV = fract(cellPos);
            
            vec4 finalColor = uBackgroundColor;
            
            float imageSize = 0.85;
            float imageBorder = (1.0 - imageSize) * 0.5;
            vec2 imageUV = (cellUV - imageBorder) / imageSize;
            bool inImageArea = imageUV.x >= 0.0 && imageUV.x <= 1.0 && imageUV.y >= 0.0 && imageUV.y <= 1.0;
            
            float texIndex = properMod(cellId.x + cellId.y * uColumnsPerRow, uTextureCount);
            
            vec2 mouseScreenUV = (uMousePos / uResolution) * 2.0 - 1.0;
            mouseScreenUV.y = -mouseScreenUV.y;
            
            float mouseRadius = length(mouseScreenUV);
            float mouseHorizontalDist = abs(mouseScreenUV.x);
            float mouseVerticalDist = abs(mouseScreenUV.y);
            
            vec2 mouseDistortedUV = mouseScreenUV;
            mouseDistortedUV.x *= (1.0 - sphereStrength * mouseVerticalDist * mouseVerticalDist);
            mouseDistortedUV.y *= (1.0 - sphereStrength * mouseHorizontalDist * mouseHorizontalDist);
            mouseDistortedUV *= (1.0 + 0.15 * (1.0 - mouseRadius * 0.5));
            
            vec2 mouseWorldCoord = mouseDistortedUV * aspectRatio * uZoom + uOffset;
            vec2 mouseCellPos = mouseWorldCoord / uCellSize;
            vec2 mouseCellId = floor(mouseCellPos);
            
            bool isHovered = (cellId == mouseCellId) && uMousePos.x >= 0.0;
            
            int cellIndexX = int(cellId.x) + 8;
            int cellIndexY = int(cellId.y) + 8;
            int cellIndex = (cellIndexX + cellIndexY * 16) % 256;
            float hoverAnimation = uHoverAnimations[cellIndex];
            
            float easedAnimation = easeInOutCubic(hoverAnimation);
            
            float atlasGridSize = ceil(sqrt(uTextureCount));
            vec2 atlasGridPos = vec2(mod(texIndex, atlasGridSize), floor(texIndex / atlasGridSize));

            if (inImageArea) {
                float edgeSmooth = 0.02;
                
                vec2 zoomedUV = imageUV;
                vec2 center = vec2(0.5, 0.5);
                float scaleAmount = 1.0 - 0.15 * easedAnimation;
                zoomedUV = (imageUV - center) * scaleAmount + center;
                
                vec2 imageMaskVec = smoothstep(-edgeSmooth, edgeSmooth, zoomedUV) * smoothstep(-edgeSmooth, edgeSmooth, 1.0 - zoomedUV);
                float imageAlpha = imageMaskVec.x * imageMaskVec.y;

                if (imageAlpha > 0.0) {
                    vec2 atlasUV = (atlasGridPos + zoomedUV) / atlasGridSize;
                    atlasUV.y = 1.0 - atlasUV.y;
                    vec4 imageTexColor = texture2D(uImageAtlas, atlasUV);
                    finalColor = mix(finalColor, imageTexColor, imageAlpha);
                }
            }
            
            float lineWidth = 0.003;
            float gridX = smoothstep(0.0, lineWidth, cellUV.x) - smoothstep(1.0 - lineWidth, 1.0, cellUV.x);
            float gridY = smoothstep(0.0, lineWidth, cellUV.y) - smoothstep(1.0 - lineWidth, 1.0, cellUV.y);
            float gridAmount = max(gridX, gridY);
            finalColor = mix(finalColor, uBorderColor, gridAmount * uBorderColor.a * 0.3);

            gl_FragColor = finalColor;
        }
    `;

    // Configuration from WordPress settings with fallbacks
    const config = {
        cellSize: parseFloat(settings.cell_size) || 0.9,
        mobileCellSize: parseFloat(settings.mobile_cell_size) || 0.75,
        columnsPerRow: parseInt(settings.columns_per_row) || 16,
        mobileColumnsPerRow: parseInt(settings.mobile_columns_per_row) || 12,
        sphereStrength: parseFloat(settings.sphere_strength) || 0.35,
        mobileSphereStrength: parseFloat(settings.mobile_sphere_strength) || 0.25,
        lerpFactor: parseFloat(settings.lerp_factor) || 0.085,
        mobileLerpFactor: parseFloat(settings.mobile_lerp_factor) || 0.12,
        zoomMin: parseFloat(settings.zoom_min) || 0.5,
        zoomMax: parseFloat(settings.zoom_max) || 2.0,
        zoomSensitivity: parseFloat(settings.zoom_sensitivity) || 0.001,
        borderColor: settings.border_color || 'rgba(80, 80, 80, 0.8)',
        backgroundColor: settings.background_color || 'rgba(28, 28, 28, 1)',
        hoverBorderColor: settings.hover_border_color || 'rgba(180, 180, 180, 1.0)',
        imageQuality: parseFloat(settings.image_quality) || 0.85,
        maxTextureSize: parseInt(settings.max_texture_size) || 2048
    };

    // Utility Functions
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    }

    function rgbaToArray(rgba) {
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
            return [
                parseInt(match[1]) / 255,
                parseInt(match[2]) / 255,
                parseInt(match[3]) / 255,
                match[4] !== undefined ? parseFloat(match[4]) : 1.0
            ];
        }
        return [0.5, 0.5, 0.5, 1.0];
    }

    // Main Gallery Class
    class PhantomGallery {
        constructor(container) {
            this.container = container;
            this.scene = null;
            this.camera = null;
            this.renderer = null;
            this.plane = null;
            this.rafId = null;
            
            this.offset = { x: 0, y: 0 };
            this.targetOffset = { x: 0, y: 0 };
            this.zoomLevel = 1.0;
            this.targetZoom = 1.0;
            
            this.isDragging = false;
            this.lastPointer = { x: 0, y: 0 };
            this.dragStartPointer = { x: 0, y: 0 };
            this.totalDragDistance = 0;
            this.mousePosition = { x: -1, y: -1 };
            this.hoverAnimations = new Float32Array(256).fill(0);
            this.isHovering = false;
            
            this.lightboxOpen = false;
            this.currentProject = null;
            this.currentImageIndex = 0;
            
            this.touchStartDistance = 0;
            this.touchMoveCount = 0;
            
            this.init();
        }

        async init() {
            try {
                this.initLightbox();
                await this.initThreeJS();
                this.setupEventListeners();
                this.hideLoading();
                this.animate();
                
                // Enable hover after initial load
                setTimeout(() => {
                    this.isHovering = true;
                }, 500);
            } catch (error) {
                console.error('Phantom Portfolio: Initialization failed', error);
                this.showError();
            }
        }

        async initThreeJS() {
            // Setup scene
            this.scene = new THREE.Scene();
            this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 20);
            this.camera.position.z = 2;
            
            // Setup renderer
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
                stencil: false,
                depth: true
            });
            
            const width = this.container.offsetWidth;
            const height = this.container.offsetHeight;
            
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setClearColor(rgbaToArray(config.backgroundColor).slice(0, 3), 0);
            
            this.container.appendChild(this.renderer.domElement);
            
            // Load textures and create atlas
            const imageTextures = await this.loadTextures();
            const imageAtlas = this.createTextureAtlas(imageTextures);
            
            // Setup uniforms
            const cellSize = isMobile() ? config.mobileCellSize : config.cellSize;
            const columnsPerRow = isMobile() ? config.mobileColumnsPerRow : config.columnsPerRow;
            const sphereStrength = isMobile() ? config.mobileSphereStrength : config.sphereStrength;
            
            const uniforms = {
                uOffset: { value: new THREE.Vector2(0, 0) },
                uResolution: { value: new THREE.Vector2(width, height) },
                uBorderColor: { value: new THREE.Vector4(...rgbaToArray(config.borderColor)) },
                uBackgroundColor: { value: new THREE.Vector4(...rgbaToArray(config.backgroundColor)) },
                uMousePos: { value: new THREE.Vector2(-1, -1) },
                uZoom: { value: 1.0 },
                uCellSize: { value: cellSize },
                uTextureCount: { value: projects.length },
                uImageAtlas: { value: imageAtlas },
                uHoverAnimations: { value: this.hoverAnimations },
                uTime: { value: 0.0 },
                uColumnsPerRow: { value: columnsPerRow },
                uSphereStrength: { value: sphereStrength }
            };
            
            // Create mesh
            const geometry = new THREE.PlaneGeometry(2, 2);
            const material = new THREE.ShaderMaterial({
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                uniforms: uniforms,
                transparent: true
            });
            
            this.plane = new THREE.Mesh(geometry, material);
            this.scene.add(this.plane);
        }

        loadTextures() {
            return new Promise((resolve, reject) => {
                const loader = new THREE.TextureLoader();
                const textures = [];
                let loadedCount = 0;
                const totalImages = projects.length;
                
                const updateProgress = () => {
                    const progress = (loadedCount / totalImages) * 100;
                    const loadingBar = document.getElementById('phantom-loadingBar');
                    if (loadingBar) {
                        loadingBar.style.width = progress + '%';
                    }
                };
                
                projects.forEach((project, index) => {
                    loader.load(
                        project.mainImage,
                        (texture) => {
                            textures[index] = texture;
                            texture.minFilter = THREE.LinearFilter;
                            texture.magFilter = THREE.LinearFilter;
                            loadedCount++;
                            updateProgress();
                            
                            if (loadedCount === totalImages) {
                                resolve(textures);
                            }
                        },
                        undefined,
                        (error) => {
                            console.error('Error loading texture:', project.mainImage, error);
                            // Create placeholder texture
                            const canvas = document.createElement('canvas');
                            canvas.width = 512;
                            canvas.height = 512;
                            const ctx = canvas.getContext('2d');
                            ctx.fillStyle = '#333';
                            ctx.fillRect(0, 0, 512, 512);
                            const placeholderTexture = new THREE.CanvasTexture(canvas);
                            textures[index] = placeholderTexture;
                            loadedCount++;
                            updateProgress();
                            
                            if (loadedCount === totalImages) {
                                resolve(textures);
                            }
                        }
                    );
                });
            });
        }

        createTextureAtlas(textures) {
            const atlasSize = Math.ceil(Math.sqrt(textures.length));
            const cellSize = Math.min(config.maxTextureSize / atlasSize, 1024);
            const totalSize = atlasSize * cellSize;
            
            const canvas = document.createElement('canvas');
            canvas.width = totalSize;
            canvas.height = totalSize;
            const ctx = canvas.getContext('2d');
            
            textures.forEach((texture, i) => {
                const x = (i % atlasSize) * cellSize;
                const y = Math.floor(i / atlasSize) * cellSize;
                
                if (texture.image) {
                    ctx.save();
                    ctx.translate(x, y + cellSize);
                    ctx.scale(1, -1);
                    ctx.drawImage(texture.image, 0, 0, cellSize, cellSize);
                    ctx.restore();
                }
            });
            
            const atlasTexture = new THREE.CanvasTexture(canvas);
            atlasTexture.minFilter = THREE.LinearFilter;
            atlasTexture.magFilter = THREE.LinearFilter;
            atlasTexture.needsUpdate = true;
            
            return atlasTexture;
        }

        setupEventListeners() {
            const canvas = this.renderer.domElement;
            const gallery = this.container;
            
            // Mouse events
            gallery.addEventListener('mousedown', this.onPointerDown.bind(this), { passive: false });
            document.addEventListener('mousemove', this.onPointerMove.bind(this), { passive: false });
            document.addEventListener('mouseup', this.onPointerUp.bind(this), { passive: false });
            document.addEventListener('mouseleave', this.onPointerUp.bind(this), { passive: false });
            
            // Touch events
            gallery.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
            document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
            document.addEventListener('touchend', this.onPointerUp.bind(this), { passive: false });
            document.addEventListener('touchcancel', this.onPointerUp.bind(this), { passive: false });
            
            // Wheel zoom
            gallery.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
            
            // Window resize
            window.addEventListener('resize', this.onWindowResize.bind(this), { passive: true });
            
            // Context menu
            gallery.addEventListener('contextmenu', (e) => {
                if (!this.lightboxOpen) e.preventDefault();
            }, { passive: false });
            
            // Mouse position tracking (desktop only)
            if (!isMobile()) {
                canvas.addEventListener('mousemove', this.updateMousePosition.bind(this), { passive: true });
                canvas.addEventListener('mouseleave', () => {
                    if (!this.lightboxOpen) {
                        this.mousePosition.x = -1;
                        this.mousePosition.y = -1;
                        if (this.plane) {
                            this.plane.material.uniforms.uMousePos.value.set(-1, -1);
                        }
                    }
                }, { passive: true });
            }
        }

        onPointerDown(e) {
            if (this.lightboxOpen) return;
            e.preventDefault();
            
            this.isDragging = true;
            this.totalDragDistance = 0;
            this.container.classList.add('dragging');
            document.body.classList.add('dragging');
            
            const pointer = this.getPointerPosition(e);
            this.lastPointer = pointer;
            this.dragStartPointer = pointer;
            
            // Disable hover during drag
            this.isHovering = false;
        }

        onPointerMove(e) {
            if (!this.isDragging || this.lightboxOpen) return;
            e.preventDefault();
            
            const pointer = this.getPointerPosition(e);
            const deltaX = pointer.x - this.lastPointer.x;
            const deltaY = pointer.y - this.lastPointer.y;
            
            // Track total distance moved
            this.totalDragDistance += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            const sensitivity = 0.003;
            this.targetOffset.x -= deltaX * sensitivity * this.zoomLevel;
            this.targetOffset.y += deltaY * sensitivity * this.zoomLevel;
            
            this.lastPointer = pointer;
        }

        onPointerUp(e) {
            if (!this.isDragging) return;
            e.preventDefault();
            
            this.isDragging = false;
            this.container.classList.remove('dragging');
            document.body.classList.remove('dragging');
            
            // Re-enable hover after drag ends
            setTimeout(() => {
                this.isHovering = true;
            }, 100);
            
            // Check if it was a click (minimal movement)
            // Increased threshold to prevent accidental clicks during drag
            const moveThreshold = 15; // pixels - increased from 5
            
            if (this.totalDragDistance < moveThreshold && this.touchMoveCount < 2) {
                this.handleClick(e);
            }
            
            this.touchMoveCount = 0;
            this.totalDragDistance = 0;
        }

        onTouchStart(e) {
            if (this.lightboxOpen) return;
            e.preventDefault();
            
            if (e.touches.length === 2) {
                // Pinch zoom
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                this.touchStartDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
            } else if (e.touches.length === 1) {
                this.onPointerDown(e);
            }
            
            this.touchMoveCount = 0;
        }

        onTouchMove(e) {
            if (this.lightboxOpen) return;
            e.preventDefault();
            
            if (e.touches.length === 2) {
                // Pinch zoom
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                
                if (this.touchStartDistance > 0) {
                    const zoomDelta = (currentDistance - this.touchStartDistance) * 0.005;
                    this.targetZoom = Math.max(config.zoomMin, Math.min(config.zoomMax, this.targetZoom - zoomDelta));
                }
                
                this.touchStartDistance = currentDistance;
            } else if (e.touches.length === 1 && this.isDragging) {
                this.onPointerMove(e);
                this.touchMoveCount++;
            }
        }

        onWheel(e) {
            if (this.lightboxOpen) return;
            e.preventDefault();
            
            const zoomDelta = e.deltaY * config.zoomSensitivity;
            this.targetZoom = Math.max(config.zoomMin, Math.min(config.zoomMax, this.targetZoom + zoomDelta));
        }

        onWindowResize() {
            const width = this.container.offsetWidth;
            const height = this.container.offsetHeight;
            
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            if (this.plane && this.plane.material.uniforms) {
                this.plane.material.uniforms.uResolution.value.set(width, height);
                
                const cellSize = isMobile() ? config.mobileCellSize : config.cellSize;
                const columnsPerRow = isMobile() ? config.mobileColumnsPerRow : config.columnsPerRow;
                const sphereStrength = isMobile() ? config.mobileSphereStrength : config.sphereStrength;
                
                this.plane.material.uniforms.uCellSize.value = cellSize;
                this.plane.material.uniforms.uColumnsPerRow.value = columnsPerRow;
                this.plane.material.uniforms.uSphereStrength.value = sphereStrength;
            }
        }

        updateMousePosition(e) {
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.mousePosition.x = e.clientX - rect.left;
            this.mousePosition.y = e.clientY - rect.top;
        }

        getPointerPosition(e) {
            if (e.touches && e.touches.length > 0) {
                return {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
            }
            return {
                x: e.clientX,
                y: e.clientY
            };
        }

        handleClick(e) {
            // Determine which cell was clicked
            const pointer = this.getPointerPosition(e);
            const rect = this.renderer.domElement.getBoundingClientRect();
            
            const screenX = ((pointer.x - rect.left) / rect.width) * 2 - 1;
            const screenY = -(((pointer.y - rect.top) / rect.height) * 2 - 1);
            
            const sphereStrength = isMobile() ? config.mobileSphereStrength : config.sphereStrength;
            const radius = Math.sqrt(screenX * screenX + screenY * screenY);
            const horizontalDist = Math.abs(screenX);
            const verticalDist = Math.abs(screenY);
            
            const verticalFold = 1.0 - sphereStrength * verticalDist * verticalDist;
            const horizontalFold = 1.0 - sphereStrength * horizontalDist * horizontalDist;
            const sphericalCurve = 1.0 + 0.15 * (1.0 - radius * 0.5);
            
            const cellSize = isMobile() ? config.mobileCellSize : config.cellSize;
            const worldX = screenX * verticalFold * sphericalCurve * (rect.width / rect.height) * this.zoomLevel + this.offset.x;
            const worldY = screenY * horizontalFold * sphericalCurve * this.zoomLevel + this.offset.y;
            
            const cellX = Math.floor(worldX / cellSize);
            const cellY = Math.floor(worldY / cellSize);
            
            const columnsPerRow = isMobile() ? config.mobileColumnsPerRow : config.columnsPerRow;
            const cellIndex = ((cellX % columnsPerRow) + columnsPerRow) % columnsPerRow +
                            (((cellY % columnsPerRow) + columnsPerRow) % columnsPerRow) * columnsPerRow;
            
            const actualIndex = cellIndex % projects.length;
            
            if (actualIndex >= 0 && actualIndex < projects.length) {
                this.openLightbox(actualIndex, 0);
            }
        }

        animate() {
            this.rafId = requestAnimationFrame(this.animate.bind(this));
            
            const lerpFactor = isMobile() ? config.mobileLerpFactor : config.lerpFactor;
            this.offset.x += (this.targetOffset.x - this.offset.x) * lerpFactor;
            this.offset.y += (this.targetOffset.y - this.offset.y) * lerpFactor;
            this.zoomLevel += (this.targetZoom - this.zoomLevel) * lerpFactor;
            
            if (this.plane && this.plane.material.uniforms && !this.lightboxOpen) {
                let currentHoveredCell = -1;
                
                // Only track hover when not dragging and hover is enabled
                if (this.mousePosition.x >= 0 && this.mousePosition.y >= 0 && !isMobile() && !this.isDragging && this.isHovering) {
                    const rect = this.renderer.domElement.getBoundingClientRect();
                    const screenX = (this.mousePosition.x / rect.width) * 2 - 1;
                    const screenY = -((this.mousePosition.y / rect.height) * 2 - 1);
                    
                    const sphereStrength = isMobile() ? config.mobileSphereStrength : config.sphereStrength;
                    const radius = Math.sqrt(screenX * screenX + screenY * screenY);
                    const horizontalDist = Math.abs(screenX);
                    const verticalDist = Math.abs(screenY);
                    
                    const verticalFold = 1.0 - sphereStrength * verticalDist * verticalDist;
                    const horizontalFold = 1.0 - sphereStrength * horizontalDist * horizontalDist;
                    const sphericalCurve = 1.0 + 0.15 * (1.0 - radius * 0.5);
                    
                    const cellSize = isMobile() ? config.mobileCellSize : config.cellSize;
                    const worldX = screenX * verticalFold * sphericalCurve * (rect.width / rect.height) * this.zoomLevel + this.offset.x;
                    const worldY = screenY * horizontalFold * sphericalCurve * this.zoomLevel + this.offset.y;
                    
                    const cellX = Math.floor(worldX / cellSize);
                    const cellY = Math.floor(worldY / cellSize);
                    
                    const cellIndexX = cellX + 8;
                    const cellIndexY = cellY + 8;
                    currentHoveredCell = (cellIndexX + cellIndexY * 16) % 256;
                }
                
                // Animate hover states
                for (let i = 0; i < 256; i++) {
                    const targetValue = (currentHoveredCell === i) ? 1.0 : 0.0;
                    const animationSpeed = 0.08;
                    
                    this.hoverAnimations[i] += (targetValue - this.hoverAnimations[i]) * animationSpeed;
                    
                    if (Math.abs(this.hoverAnimations[i] - targetValue) < 0.001) {
                        this.hoverAnimations[i] = targetValue;
                    }
                }
                
                this.plane.material.uniforms.uOffset.value.set(this.offset.x, this.offset.y);
                this.plane.material.uniforms.uZoom.value = this.zoomLevel;
                this.plane.material.uniforms.uHoverAnimations.value = this.hoverAnimations;
                this.plane.material.uniforms.uTime.value = performance.now() * 0.001;
            }
            
            this.renderer.render(this.scene, this.camera);
        }

        initLightbox() {
            const lightbox = document.getElementById('phantom-lightbox');
            const closeBtn = document.getElementById('phantom-lightbox-close');
            const lightboxImg = document.getElementById('phantom-lightbox-img');
            const thumbnails = document.getElementById('phantom-lightbox-thumbnails');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeLightbox());
            }
            
            if (lightbox) {
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) {
                        this.closeLightbox();
                    }
                });
            }
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!this.lightboxOpen) return;
                
                if (e.key === 'Escape') {
                    this.closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    this.previousImage();
                } else if (e.key === 'ArrowRight') {
                    this.nextImage();
                }
            });
            
            // Navigation buttons
            const prevBtn = document.querySelector('.phantom-lightbox-prev');
            const nextBtn = document.querySelector('.phantom-lightbox-next');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.previousImage());
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.nextImage());
            }
        }

        openLightbox(projectIndex, imageIndex) {
            this.currentProject = projects[projectIndex];
            this.currentImageIndex = imageIndex;
            this.lightboxOpen = true;
            
            const lightbox = document.getElementById('phantom-lightbox');
            const lightboxImg = document.getElementById('phantom-lightbox-img');
            const title = document.querySelector('.phantom-lightbox-title');
            const meta = document.querySelector('.phantom-lightbox-meta');
            const viewProject = document.querySelector('.phantom-lightbox-view-project');
            
            // Add classes
            lightbox.classList.add('open');
            this.container.classList.add('blur');
            document.body.classList.add('phantom-lightbox-active');
            
            // Set content
            if (title) {
                title.textContent = this.currentProject.title || '';
            }
            
            if (meta) {
                let metaText = '';
                if (this.currentProject.client) metaText += this.currentProject.client + ' • ';
                if (this.currentProject.date) metaText += this.currentProject.date;
                meta.textContent = metaText;
            }
            
            // Update view project link
            if (viewProject) {
                if (this.currentProject.permalink) {
                    viewProject.href = this.currentProject.permalink;
                    viewProject.style.display = 'inline-block';
                } else {
                    viewProject.style.display = 'none';
                }
            }
            
            // Load image
            this.loadLightboxImage(this.currentProject.images[imageIndex]);
            
            // Generate thumbnails
            this.generateThumbnails();
        }

        closeLightbox() {
            const lightbox = document.getElementById('phantom-lightbox');
            
            lightbox.classList.remove('open');
            this.container.classList.remove('blur');
            document.body.classList.remove('phantom-lightbox-active');
            
            this.lightboxOpen = false;
            this.currentProject = null;
        }

        loadLightboxImage(imageUrl) {
            const lightboxImg = document.getElementById('phantom-lightbox-img');
            
            if (!lightboxImg) return;
            
            lightboxImg.classList.remove('loaded');
            lightboxImg.src = '';
            
            const img = new Image();
            img.onload = () => {
                lightboxImg.src = imageUrl;
                setTimeout(() => {
                    lightboxImg.classList.add('loaded');
                }, 50);
            };
            img.src = imageUrl;
        }

        generateThumbnails() {
            const thumbnails = document.getElementById('phantom-lightbox-thumbnails');
            
            if (!thumbnails || !this.currentProject) return;
            
            thumbnails.innerHTML = '';
            
            this.currentProject.images.forEach((imageUrl, index) => {
                const thumb = document.createElement('div');
                thumb.className = 'phantom-lightbox-thumbnail';
                if (index === this.currentImageIndex) {
                    thumb.classList.add('active');
                }
                
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = '';
                
                thumb.appendChild(img);
                thumb.addEventListener('click', () => {
                    this.currentImageIndex = index;
                    this.loadLightboxImage(imageUrl);
                    this.updateThumbnailsActive();
                });
                
                thumbnails.appendChild(thumb);
            });
        }

        updateThumbnailsActive() {
            const thumbnails = document.querySelectorAll('.phantom-lightbox-thumbnail');
            thumbnails.forEach((thumb, index) => {
                if (index === this.currentImageIndex) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            });
        }

        previousImage() {
            if (!this.currentProject) return;
            
            this.currentImageIndex = (this.currentImageIndex - 1 + this.currentProject.images.length) % this.currentProject.images.length;
            this.loadLightboxImage(this.currentProject.images[this.currentImageIndex]);
            this.updateThumbnailsActive();
        }

        nextImage() {
            if (!this.currentProject) return;
            
            this.currentImageIndex = (this.currentImageIndex + 1) % this.currentProject.images.length;
            this.loadLightboxImage(this.currentProject.images[this.currentImageIndex]);
            this.updateThumbnailsActive();
        }

        hideLoading() {
            const loading = document.getElementById('phantom-loading');
            if (loading) {
                loading.classList.add('hidden');
            }
            
            this.container.classList.add('loaded');
        }

        showError() {
            const loading = document.getElementById('phantom-loading');
            if (loading) {
                loading.innerHTML = '<div class="phantom-loading-text">FAILED TO INITIALIZE</div>';
            }
        }

        destroy() {
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
            
            if (this.renderer) {
                this.renderer.dispose();
            }
            
            if (this.plane) {
                this.plane.geometry.dispose();
                this.plane.material.dispose();
            }
        }
    }

    // Initialize gallery when DOM is ready
    $(document).ready(function() {
        const galleryContainer = document.getElementById('phantom-gallery');
        
        if (galleryContainer && projects.length > 0) {
            new PhantomGallery(galleryContainer);
        }
    });

    } // End initPhantomGallery

    // Wait for Three.js to load
    var attempts = 0;
    var maxAttempts = 50; // 5 seconds max wait
    
    function checkThreeJS() {
        if (typeof THREE !== 'undefined') {
            // Three.js is loaded, initialize
            initPhantomGallery();
        } else if (attempts < maxAttempts) {
            // Wait and try again
            attempts++;
            setTimeout(checkThreeJS, 100);
        } else {
            // Timeout - show error
            console.error('Phantom Portfolio: Three.js failed to load after 5 seconds');
            var loading = document.getElementById('phantom-loading');
            if (loading) {
                loading.innerHTML = '<div class="phantom-loading-text">ERROR: Failed to load 3D library</div>' +
                    '<div class="phantom-loading-text" style="font-size: 10px; margin-top: 10px;">Please check your internet connection and refresh</div>';
            }
        }
    }

    // Start checking when document is ready
    $(document).ready(function() {
        checkThreeJS();
    });

})(jQuery);
