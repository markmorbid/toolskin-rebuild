// ==UserScript==
// @name         Higgsfield Automation v4.9.6
// @namespace    http://tampermonkey.net/
// @version      4.9.6
// @description  Automates Higgsfield with persistent storage, advanced UI, and robust tracking system. Fixed: logging, auto-download, download tracking, lightbox URLs.
// @author       SatoshiSea
// @match        https://higgsfield.ai/create/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @resource     IMPORTED_CSS https://satsea.io/video-calendar/hf_userscript-v-6.css?v=4.9.6.2
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-start
// @connect      higgsfield.ai
// @grant        unsafeWindow
// @connect      satsea.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=higgsfield.ai
// ==/UserScript==

(function () {
    'use strict';

    // Set to true to enable toast test buttons (appears in bottom-right corner)
    const ENABLE_TOAST_TESTS = false;

    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // Load CSS with cache-busting - fetch directly to avoid caching issues
    const CSS_URL = 'https://satsea.io/video-calendar/hf_userscript-v-6.css';
    const CSS_VERSION = GM_info?.script?.version || '4.9.6';
    const cssUrlWithCacheBust = `${CSS_URL}?v=${CSS_VERSION}&t=${Date.now()}`;

    // Try to get from resource first (faster), fallback to direct fetch
    let importedCSS;
    try {
        importedCSS = GM_getResourceText('IMPORTED_CSS');
    } catch (e) {
        console.warn('[CSS] Failed to load from resource, will fetch directly');
        importedCSS = null;
    }

    // If resource failed or we want to force fresh fetch, use GM_xmlhttpRequest
    if (!importedCSS) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: cssUrlWithCacheBust,
            onload: function (response) {
                if (response.status === 200) {
                    GM_addStyle(response.responseText);
                    console.log('[CSS] Loaded CSS with cache-busting');
                } else {
                    console.error('[CSS] Failed to load CSS:', response.status);
                }
            },
            onerror: function (error) {
                console.error('[CSS] Error loading CSS:', error);
            }
        });
    } else {
        GM_addStyle(importedCSS);
    }

    /**************************************************************
     *   SCRIPT METADATA FROM GM_info
     **************************************************************/
    // Extract version and name from GM_info with fallbacks
    const SCRIPT_VERSION = (typeof GM_info !== 'undefined' && GM_info.script?.version)
        ? GM_info.script.version
        : '4.9.6';
    const SCRIPT_NAME = (typeof GM_info !== 'undefined' && GM_info.script?.name)
        ? GM_info.script.name.replace(/\s*v[\d.]+$/, '') // Remove version suffix if present
        : 'Higgsfield Automation';

    /**************************************************************
     *   GM STORAGE KEYS & PERSISTENCE
     **************************************************************/
    const GM_KEYS = {
        QUEUE: 'hf_queue_v4',           // Main job queue
        HISTORY: 'hf_history_v4',        // Completed jobs log
        SETTINGS: 'hf_settings_v4',       // UI preferences (positions, colors)
        MAPPING: 'hf_id_mapping',        // Map<CellID, QueueID> for tracking
        THEME: 'hf_theme_config',        // CSS variable overrides
        DOWNLOAD_LOG: 'hf_download_log',  // Download history with filenames
        WORKFLOW_LOG: 'hf_workflow_log',  // Workflow logging for process tracking
        AUTO_DOWNLOAD: 'hf_auto_download_enabled',  // Auto-download setting
        DOWNLOADED_FILES: 'hf_downloaded_files',  // Set of downloaded queue IDs
        VIDEO_MAPPING: 'hf_video_mapping'  // Comprehensive mapping: videoId -> {originalId, prompt, imgUrl, cellId, index}
    };

    // Load Google Fonts with proper MIME type
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.type = 'text/css';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Victor+Mono:ital,wght@0,100..700;1,100..700&display=swap';
    document.head.appendChild(fontLink);
    /**************************************************************
     *   STORAGE MANAGER CLASS
     **************************************************************/
    class HFStorage {
        static getQueue() {
            try {
                const stored = GM_getValue(GM_KEYS.QUEUE, '[]');
                return JSON.parse(stored);
            } catch (e) {
                console.error('Failed to load queue:', e);
                return [];
            }
        }

        static saveQueue(queue) {
            try {
                GM_setValue(GM_KEYS.QUEUE, JSON.stringify(queue));
            } catch (e) {
                console.error('Failed to save queue:', e);
            }
        }

        static getHistory() {
            try {
                const stored = GM_getValue(GM_KEYS.HISTORY, '[]');
                return JSON.parse(stored);
            } catch (e) {
                console.error('Failed to load history:', e);
                return [];
            }
        }

        static saveHistory(history) {
            try {
                GM_setValue(GM_KEYS.HISTORY, JSON.stringify(history));
            } catch (e) {
                console.error('Failed to save history:', e);
            }
        }

        static addToHistory(item) {
            const history = this.getHistory();
            history.push({
                ...item,
                completedAt: Date.now()
            });
            // Keep only last 1000 entries
            if (history.length > 1000) {
                history.splice(0, history.length - 1000);
            }
            this.saveHistory(history);
        }

        static getMapping() {
            try {
                const stored = GM_getValue(GM_KEYS.MAPPING, '{}');
                return JSON.parse(stored);
            } catch (e) {
                console.error('Failed to load mapping:', e);
                return {};
            }
        }

        static saveMapping(mapping) {
            try {
                GM_setValue(GM_KEYS.MAPPING, JSON.stringify(mapping));
            } catch (e) {
                console.error('Failed to save mapping:', e);
            }
        }

        static addMapping(cellId, queueId, status = 'processing') {
            const mapping = this.getMapping();
            mapping[cellId] = {
                queueId,
                status,
                timestamp: Date.now()
            };
            this.saveMapping(mapping);
        }

        static removeMapping(cellId) {
            const mapping = this.getMapping();
            delete mapping[cellId];
            this.saveMapping(mapping);
        }

        static getSettings() {
            try {
                const stored = GM_getValue(GM_KEYS.SETTINGS, '{}');
                return JSON.parse(stored);
            } catch (e) {
                return {};
            }
        }

        static saveSettings(settings) {
            try {
                GM_setValue(GM_KEYS.SETTINGS, JSON.stringify(settings));
            } catch (e) {
                console.error('Failed to save settings:', e);
            }
        }

        static getDownloadLog() {
            try {
                const stored = GM_getValue(GM_KEYS.DOWNLOAD_LOG, '[]');
                return JSON.parse(stored);
            } catch (e) {
                return [];
            }
        }

        static addDownloadLog(entry) {
            const log = this.getDownloadLog();
            log.push({
                ...entry,
                timestamp: Date.now()
            });
            if (log.length > 1000) {
                log.splice(0, log.length - 1000);
            }
            try {
                GM_setValue(GM_KEYS.DOWNLOAD_LOG, JSON.stringify(log));
            } catch (e) {
                console.error('Failed to save download log:', e);
            }
        }

        static getWorkflowLog() {
            try {
                const stored = GM_getValue(GM_KEYS.WORKFLOW_LOG, '[]');
                return JSON.parse(stored);
            } catch (e) {
                console.error('[HFStorage] Failed to get workflow log:', e);
                return [];
            }
        }

        static saveWorkflowLog(logs) {
            try {
                GM_setValue(GM_KEYS.WORKFLOW_LOG, JSON.stringify(logs));
            } catch (e) {
                console.error('[HFStorage] Failed to save workflow log:', e);
            }
        }

        static getAutoDownload() {
            try {
                const value = GM_getValue(GM_KEYS.AUTO_DOWNLOAD, true); // Default: enabled
                return value === true || value === 'true';
            } catch (e) {
                return true;
            }
        }

        static setAutoDownload(enabled) {
            try {
                GM_setValue(GM_KEYS.AUTO_DOWNLOAD, enabled);
            } catch (e) {
                console.error('Failed to save auto-download setting:', e);
            }
        }

        static getDownloadedFiles() {
            try {
                const stored = GM_getValue(GM_KEYS.DOWNLOADED_FILES, '[]');
                return new Set(JSON.parse(stored));
            } catch (e) {
                return new Set();
            }
        }

        static addDownloadedFile(queueId) {
            const downloaded = this.getDownloadedFiles();
            downloaded.add(queueId);
            GM_setValue(GM_KEYS.DOWNLOADED_FILES, JSON.stringify([...downloaded]));
        }

        static isDownloaded(queueId) {
            const downloaded = this.getDownloadedFiles();
            return downloaded.has(queueId);
        }

        static getVideoMapping() {
            try {
                const stored = GM_getValue(GM_KEYS.VIDEO_MAPPING, '{}');
                return JSON.parse(stored);
            } catch (e) {
                console.error('Failed to load video mapping:', e);
                return {};
            }
        }

        static saveVideoMapping(mapping) {
            try {
                GM_setValue(GM_KEYS.VIDEO_MAPPING, JSON.stringify(mapping));
            } catch (e) {
                console.error('Failed to save video mapping:', e);
            }
        }

        static addVideoMapping(videoId, mappingData) {
            const mapping = this.getVideoMapping();
            mapping[videoId] = {
                ...mappingData,
                timestamp: Date.now()
            };
            this.saveVideoMapping(mapping);
        }

        static getVideoMappingByOriginalId(originalId) {
            const mapping = this.getVideoMapping();
            for (const [videoId, data] of Object.entries(mapping)) {
                if (data.originalId === originalId) {
                    return { videoId, ...data };
                }
            }
            return null;
        }
    }

    // --- CONFIG & STATE ---
    const CONFIG = {
        stepDelay: 1500,        // Time between UI actions
        genWaitDelay: 15000,    // Time to wait after clicking generate before cleaning up
        maxRetries: 3
    };

    const STATE = {
        queue: HFStorage.getQueue(),              // Load from storage
        isProcessing: false,
        isPaused: false,
        processedCount: 0,
        generationMap: new Map() // Maps CellID -> QueueItem (in-memory for fast access)
    };

    // Load mappings from storage into memory
    const storedMappings = HFStorage.getMapping();
    Object.entries(storedMappings).forEach(([cellId, data]) => {
        // Find queue item by ID
        const item = STATE.queue.find(q => q.id === data.queueId);
        if (item) {
            STATE.generationMap.set(cellId, item);
            item.cellId = cellId;
        }
    });

    /**************************************************************
     *   HELPER FUNCTIONS
     **************************************************************/

    /**************************************************************
           *   IONICONS INTEGRATION
           **************************************************************/
    const injectIonicons = () => {
        // Check if already injected
        if (document.querySelector('script[src*="ionicons"]')) return;

        // ESM version (modern browsers)
        const scriptESM = document.createElement('script');
        scriptESM.type = 'module';
        scriptESM.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js';
        document.body.appendChild(scriptESM);

        // nomodule version (fallback for older browsers)
        const scriptNoModule = document.createElement('script');
        scriptNoModule.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js';
        scriptNoModule.setAttribute('nomodule', '');
        document.body.appendChild(scriptNoModule);

        console.log('[${SCRIPT_NAME}] Ionicons injected');
    };

    /* // Helper to create Ionicon element
    const createIonIcon = (name, options = {}) => {
        const icon = document.createElement('ion-icon');
        icon.setAttribute('name', name);
        if (options.size) icon.style.fontSize = options.size;
        if (options.color) icon.style.color = options.color;
        if (options.outline) icon.setAttribute('name', `${name}-outline`);
        if (options.sharp) icon.setAttribute('name', `${name}-sharp`);
        if (options.ariaLabel) icon.setAttribute('aria-label', options.ariaLabel);
        else icon.setAttribute('aria-hidden', 'true');
        return icon;
    };

    // Mapping from ICONS object keys to Ionicons names
    const IONICONS_MAP = {
        play: 'play',
        stop: 'stop',
        pause: 'pause',
        check: 'checkmark',
        chartBar: 'bar-chart',
        download: 'download',
        cloudDownload: 'cloud-download',
        copy: 'copy',
        eye: 'eye',
        eyeSlash: 'eye-off',
        fileExport: 'download-outline',
        layerGroup: 'layers',
        xmark: 'close',
        minus: 'remove',
        chartLine: 'trending-up',
        music: 'musical-notes',
        trash: 'trash',
        refresh: 'refresh',
        info: 'information-circle',
        warning: 'warning',
        error: 'close-circle',
        success: 'checkmark-circle',
        circle: 'ellipse',
        gear: 'settings',
        chevronUp: 'chevron-up',
        chevronDown: 'chevron-down',
        createMusic: 'add-circle',
        search: 'search',
        bolt: 'flash',
        barChart: 'bar-chart',
        calendar: 'calendar',
        time: 'time',
        clear: 'broom',
        cloudDownload: 'cloud-download',
        flash: 'flash',
        timer: 'timer',
        checkmark: 'checkmark',
        checkmarkCircle: 'checkmark-circle',
        errorCircle: 'close-circle',
        successCircle: 'checkmark-circle',
        warningCircle: 'warning-circle',
        informationCircle: 'information-circle',
    }; */
    // Create element helper
    const createElement = (tag, attributes = {}) => {
        const el = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'class' || key === 'className') {
                el.className = Array.isArray(value) ? value.join(' ') : value;
            } else if (key.startsWith('data-')) {
                el.setAttribute(key, value);
            } else if (key === 'text') {
                el.textContent = value;
            } else {
                el[key] = value;
            }
        });
        return el;
    };

    // Icon creation helper (simplified - uses ion-icon)
    const createIcon = (iconName, size = null) => {
        if (!iconName) {
            const span = document.createElement('span');
            span.className = 'hf-icon';
            return span;
        }

        const icon = document.createElement('ion-icon');
        icon.setAttribute('name', iconName);
        icon.className = 'hf-icon';
        if (size) {
            icon.style.fontSize = size;
        }
        icon.setAttribute('aria-hidden', 'true');
        return icon;
    };

    // Get default icon for button text
    const getDefaultButtonIcon = (text) => {
        const textLower = text.toLowerCase();
        if (textLower.includes('clear') || textLower.includes('delete') || textLower.includes('remove')) return 'trash';
        if (textLower.includes('export') || textLower.includes('save') || textLower.includes('download')) return 'download';
        if (textLower.includes('refresh') || textLower.includes('reload')) return 'refresh';
        if (textLower.includes('close') || textLower.includes('cancel')) return 'close';
        if (textLower.includes('settings') || textLower.includes('config')) return 'settings';
        if (textLower.includes('start') || textLower.includes('play')) return 'play';
        if (textLower.includes('stop')) return 'stop';
        if (textLower.includes('pause')) return 'pause';
        if (textLower.includes('resume')) return 'play';
        if (textLower.includes('copy')) return 'copy';
        if (textLower.includes('import') || textLower.includes('upload')) return 'cloud-upload';
        if (textLower.includes('view') || textLower.includes('show')) return 'eye';
        return null;
    };

    // Utility: sleep function
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    /**************************************************************
     *   UI COMPONENT CLASSES (Ported from Suno)
     **************************************************************/

    /**************************************************************
     *   SMART BUTTON CLASS
     **************************************************************/
    class HFSmartButton {
        constructor(config) {
            this.id = config.id;
            this.text = config.text || '';
            this.icon = config.icon || '';
            this.classes = Array.isArray(config.classes) ? config.classes : (config.classes ? [config.classes] : ['hf-btn']);
            this.tooltip = config.tooltip || '';
            this.styles = config.styles || {};
            this.handlers = config.handlers || {};
            this.states = config.states || null;
            this.currentState = null;
            this.element = null;
            this.counterElement = null;
            this.showCounter = config.showCounter || false;
            this.initialize();
        }

        initialize() {
            this.element = this.createButtonElement();
            this.setupEventHandlers();
            this.setupStates();
            this.element.smartButton = this;
        }

        createButtonElement() {
            const button = document.createElement('button');
            button.id = this.id;
            button.className = this.classes.join(' ');

            let iconToUse = this.icon;
            if (!iconToUse && this.text) {
                iconToUse = getDefaultButtonIcon(this.text);
            }

            if (iconToUse) {
                const iconEl = createIcon(iconToUse);
                button.appendChild(iconEl);
            }

            const textSpan = document.createElement('span');
            textSpan.className = 'hf-btn-text';
            if (this.text) {
                textSpan.textContent = this.text.trim();
            }
            button.appendChild(textSpan);

            if (this.showCounter) {
                this.counterElement = document.createElement('span');
                this.counterElement.className = 'hf-button-counter';
                button.appendChild(this.counterElement);
            }

            if (this.tooltip) {
                button.setAttribute('data-tooltip', this.tooltip);
            }

            Object.assign(button.style, this.styles);

            return button;
        }

        setupEventHandlers() {
            if (this.handlers.onClick) {
                this.element.onclick = (e) => {
                    this.handlers.onClick(e, this);
                };
            }

            Object.keys(this.handlers).forEach(eventType => {
                if (eventType !== 'onClick' && eventType.startsWith('on')) {
                    const eventName = eventType.replace('on', '').toLowerCase();
                    this.element.addEventListener(eventName, (e) => {
                        this.handlers[eventType](e, this);
                    });
                }
            });
        }

        setupStates() {
            if (!this.states) return;
            const stateNames = Object.keys(this.states);
            if (stateNames.length > 0) {
                this.currentState = stateNames[0];
                this.setState(this.currentState);
            }
        }

        setState(newState) {
            if (!this.states || !this.states[newState]) return;

            const stateConfig = this.states[newState];
            this.currentState = newState;

            if (stateConfig.icon) {
                const iconEl = this.element.querySelector('.hf-icon');
                if (iconEl) {
                    const newIcon = createIcon(stateConfig.icon);
                    iconEl.replaceWith(newIcon);
                } else if (this.element.firstChild) {
                    const newIcon = createIcon(stateConfig.icon);
                    this.element.insertBefore(newIcon, this.element.firstChild);
                }
            }

            if (stateConfig.text !== undefined) {
                const textSpan = this.element.querySelector('.hf-btn-text');
                if (textSpan) {
                    textSpan.textContent = stateConfig.text || '';
                }
            }

            if (stateConfig.classes) {
                this.element.className = stateConfig.classes.join(' ');
            }

            if (stateConfig.tooltip) {
                this.element.setAttribute('data-tooltip', stateConfig.tooltip);
            }

            if (stateConfig.styles) {
                Object.assign(this.element.style, stateConfig.styles);
            }
        }

        updateCounter(current, total, mode = 'numeric') {
            if (!this.counterElement) return;
            this.counterElement.style.display = 'inline-block';
            if (mode === 'percent') {
                const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
                this.counterElement.textContent = `(${percentage}%)`;
            } else {
                this.counterElement.textContent = `(${current}/${total})`;
            }
        }

        hideCounter() {
            if (!this.counterElement) return;
            this.counterElement.style.display = 'none';
            this.counterElement.textContent = '';
        }

        getElement() { return this.element; }
        enable() { this.element.disabled = false; }
        disable() { this.element.disabled = true; }
        show() { this.element.style.display = ''; }
        hide() { this.element.style.display = 'none'; }
        addClass(className) { this.element.classList.add(className); }
        removeClass(className) { this.element.classList.remove(className); }
        setText(text) {
            const textSpan = this.element.querySelector('span:not(.hf-button-counter)');
            if (textSpan) {
                textSpan.textContent = text ? text.trim() : '';
            }
        }
        setIcon(iconName) {
            const iconEl = this.element.querySelector('.hf-icon');
            const newIcon = createIcon(iconName);
            if (iconEl) {
                iconEl.replaceWith(newIcon);
            } else {
                this.element.insertBefore(newIcon, this.element.firstChild);
            }
        }
    }

    function createSmartButton(config) {
        return new HFSmartButton(config);
    }

    /**************************************************************
     *   MODAL BUILDER CLASS
     **************************************************************/
    class HFModalBuilder {
        constructor(title, options = {}) {
            this.titleText = title;
            this.titleIcon = options.titleIcon || null;
            this.options = {
                id: 'hf-modal-overlay',
                maxWidth: '600px',
                draggable: false,
                showCloseButton: true,
                showBackButton: false,
                onBack: null,
                counter: undefined,
                closeOnOverlayClick: true,
                customClasses: null,
                ...options
            };

            this.elements = {
                overlay: document.createElement('div'),
                modal: document.createElement('div'),
                titleBar: document.createElement('div'),
                titleH3: document.createElement('h3'),
                contentArea: document.createElement('div'),
                actionsBar: document.createElement('div'),
                leftActions: document.createElement('div'),
                rightActions: document.createElement('div'),
            };

            this.titleBarElements = {
                backButton: null,
                closeButton: null,
                counter: null
            };

            this.onClose = null;
            this._createBaseStructure();
        }

        _createBaseStructure() {
            this.elements.overlay.id = this.options.id;
            this.elements.overlay.className = 'hf-modal-overlay';
            if (this.options.closeOnOverlayClick) {
                this.elements.overlay.classList.add('closable');
            }

            this.elements.modal.className = 'hf-modal-content';
            this.elements.modal.style.maxWidth = this.options.maxWidth;

            if (this.options.customClasses) {
                const classes = Array.isArray(this.options.customClasses) ?
                    this.options.customClasses :
                    this.options.customClasses.split(' ');
                this.elements.modal.classList.add(...classes.filter(Boolean));
            }

            this.elements.titleBar.className = 'hf-modal-title';

            if (this.options.showBackButton) {
                const backBtn = createElement('button', { class: 'hf-btn hf-btn-icon' });
                backBtn.appendChild(createIcon('arrow-back'));
                backBtn.addEventListener('click', async () => {
                    if (this.options.onBack) {
                        await this.options.onBack();
                    }
                    this.close();
                });
                this.elements.titleBar.appendChild(backBtn);
                this.titleBarElements.backButton = backBtn;
            }

            if (this.titleIcon) {
                this.elements.titleH3.appendChild(createIcon(this.titleIcon, '16px'));
            }
            this.elements.titleH3.appendChild(document.createTextNode(this.titleText));
            if (this.options.counter !== undefined && this.options.counter !== null) {
                const counterSpan = document.createElement('span');
                counterSpan.className = 'hf-counter';
                counterSpan.textContent = `(${this.options.counter})`;
                this.elements.titleH3.appendChild(counterSpan);
                this.titleBarElements.counter = counterSpan;
            }
            this.elements.titleBar.appendChild(this.elements.titleH3);

            if (this.options.showCloseButton) {
                const closeBtn = createElement('button', { class: 'hf-btn hf-btn-icon' });
                closeBtn.appendChild(createIcon('close'));
                closeBtn.addEventListener('click', () => this.close());
                this.elements.titleBar.appendChild(closeBtn);
                this.titleBarElements.closeButton = closeBtn;
            }

            this.elements.contentArea.className = 'hf-modal-view';
            this.elements.actionsBar.className = 'hf-modal-actions';
            this.elements.leftActions.className = 'hf-modal-actions-left';
            this.elements.rightActions.className = 'hf-modal-actions-right';
            this.elements.actionsBar.appendChild(this.elements.leftActions);
            this.elements.actionsBar.appendChild(this.elements.rightActions);

            this.elements.modal.appendChild(this.elements.titleBar);
            this.elements.modal.appendChild(this.elements.contentArea);
            this.elements.modal.appendChild(this.elements.actionsBar);
            this.elements.overlay.appendChild(this.elements.modal);

            if (this.options.draggable) {
                this._makeDraggable();
            }
        }

        _makeDraggable() {
            const handle = this.elements.titleBar;
            const el = this.elements.modal;
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            handle.style.cursor = 'move';
            handle.onmousedown = (e) => {
                if (e.target.closest('button')) return;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            };

            const elementDrag = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                let newTop = el.offsetTop - pos2;
                let newLeft = el.offsetLeft - pos1;
                const maxLeft = window.innerWidth - el.offsetWidth;
                const maxTop = window.innerHeight - el.offsetHeight;
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));
                el.style.top = newTop + 'px';
                el.style.left = newLeft + 'px';
                el.style.right = 'auto';
                el.style.bottom = 'auto';
            };

            const closeDragElement = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            };
        }

        setContent(content) {
            while (this.elements.contentArea.firstChild) {
                this.elements.contentArea.removeChild(this.elements.contentArea.firstChild);
            }

            if (typeof content === 'string') {
                const p = document.createElement('div');
                p.textContent = content;
                this.elements.contentArea.appendChild(p);
            } else if (Array.isArray(content)) {
                content.forEach(el => {
                    if (el instanceof HTMLElement) {
                        this.elements.contentArea.appendChild(el);
                    } else if (typeof el === 'string') {
                        const p = document.createElement('div');
                        p.textContent = el;
                        this.elements.contentArea.appendChild(p);
                    }
                });
            } else if (content instanceof HTMLElement) {
                this.elements.contentArea.appendChild(content);
            }
            return this;
        }

        addContent(content) {
            return this.setContent(content);
        }

        addButtons(buttons) {
            if (!Array.isArray(buttons)) buttons = [buttons];

            while (this.elements.leftActions.firstChild) {
                this.elements.leftActions.removeChild(this.elements.leftActions.firstChild);
            }
            while (this.elements.rightActions.firstChild) {
                this.elements.rightActions.removeChild(this.elements.rightActions.firstChild);
            }

            buttons.forEach((buttonConfig, index) => {
                let button;
                let position = buttonConfig.position || null;

                if (buttonConfig instanceof HTMLElement) {
                    button = buttonConfig;
                } else if (buttonConfig.smartButton) {
                    button = buttonConfig.getElement();
                } else {
                    button = this._createButton(buttonConfig);
                }

                if (position === 'right') {
                    this.elements.rightActions.appendChild(button);
                } else if (position === 'left') {
                    this.elements.leftActions.appendChild(button);
                } else {
                    if (buttons.length <= 3) {
                        this.elements.leftActions.appendChild(button);
                    } else {
                        if (index < 3) {
                            this.elements.leftActions.appendChild(button);
                        } else {
                            this.elements.rightActions.appendChild(button);
                        }
                    }
                }
            });
            return this;
        }

        _createButton(config) {
            const button = document.createElement('button');
            button.className = config.classes ? config.classes.join(' ') : 'hf-btn';
            if (config.id) button.id = config.id;
            if (config.text) {
                const span = document.createElement('span');
                span.textContent = config.text;
                button.appendChild(span);
            }
            if (config.icon) {
                button.insertBefore(createIcon(config.icon), button.firstChild);
            }
            if (config.onClick) {
                // Use addEventListener instead of onclick to ensure it works
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        const result = config.onClick(e, this);
                        // Handle async functions
                        if (result && typeof result.then === 'function') {
                            result.catch(err => {
                                console.error('[Modal Button] Error in onClick handler:', err);
                                logError('Modal button error:', err);
                            });
                        }
                    } catch (error) {
                        console.error('[Modal Button] Error in onClick handler:', error);
                        logError('Modal button error:', error);
                    }
                });
            }
            if (config.tooltip) {
                button.setAttribute('data-tooltip', config.tooltip);
            }
            return button;
        }

        updateCounter(value) {
            if (value === undefined || value === null || value === '') {
                if (this.titleBarElements.counter) {
                    this.titleBarElements.counter.remove();
                    this.titleBarElements.counter = null;
                }
                return;
            }

            if (this.titleBarElements.counter) {
                this.titleBarElements.counter.textContent = `(${value})`;
            } else {
                const counterSpan = document.createElement('span');
                counterSpan.className = 'hf-counter';
                counterSpan.textContent = `(${value})`;
                this.elements.titleH3.appendChild(counterSpan);
                this.titleBarElements.counter = counterSpan;
            }
        }

        show() {
            return new Promise(resolve => {
                this.onClose = resolve;

                const existingModal = document.getElementById(this.options.id);
                if (existingModal) existingModal.remove();

                if (this.options.closeOnOverlayClick) {
                    this.elements.overlay.addEventListener('click', (e) => {
                        if (e.target === this.elements.overlay) {
                            this.close(null);
                        }
                    });
                }

                const escapeHandler = (e) => {
                    if (e.key === 'Escape') {
                        this.close(null);
                        document.removeEventListener('keydown', escapeHandler);
                    }
                };
                document.addEventListener('keydown', escapeHandler);

                const uiRoot = document.getElementById('hf-ui-root') || document.body;
                uiRoot.appendChild(this.elements.overlay);
                requestAnimationFrame(() => {
                    this.elements.overlay.classList.add('visible');
                });
            });
        }

        close(value = null) {
            if (this.elements.overlay && this.elements.overlay.parentElement) {
                this.elements.overlay.classList.remove('visible');
                setTimeout(() => {
                    if (this.elements.overlay.parentElement) {
                        this.elements.overlay.remove();
                    }
                }, 150);
            }
            if (this.onClose) {
                this.onClose(value);
            }
        }

        getModal() {
            return this.elements.modal;
        }

        getOverlay() {
            return this.elements.overlay;
        }

        getViewContainer() {
            return this.elements.contentArea;
        }
    }

    /**************************************************************
     *   TABLE SORTER CLASS
     **************************************************************/
    class TableSorter {
        constructor(table, initialSort = {}) {
            this.table = table;
            this.thead = table.querySelector('thead');
            this.tbody = table.querySelector('tbody');
            this.sortableHeaders = [];
            this.currentSortKey = null;
            this.currentReverse = false;
            this._initHeaders();
            if (initialSort.key) {
                this.sort(initialSort.key, initialSort.reverse);
            }
        }

        _initHeaders() {
            this.thead.querySelectorAll('th[data-sort-key]').forEach(th => {
                const sortKey = th.dataset.sortKey;
                // Filter out null, empty string, or the string "null"
                if (!sortKey || sortKey === '' || sortKey === 'null' || sortKey === 'undefined') return;

                th.classList.add('sortable');
                th.style.cursor = 'pointer';
                this.sortableHeaders.push(th);
                th.addEventListener('click', () => {
                    const shouldReverse = (this.currentSortKey === sortKey) ? !this.currentReverse : false;
                    this.sort(sortKey, shouldReverse);
                });
            });
        }

        sort(columnKey, reverse = false) {
            this.currentSortKey = columnKey;
            this.currentReverse = reverse;

            this.sortableHeaders.forEach(th => {
                th.classList.remove('sorted', 'reverse');
                if (th.dataset.sortKey === columnKey) {
                    th.classList.add('sorted');
                    if (reverse) {
                        th.classList.add('reverse');
                    }
                }
            });

            const rows = Array.from(this.tbody.querySelectorAll('tr'));
            const targetHeader = this.sortableHeaders.find(th => th.dataset.sortKey === columnKey);
            if (!targetHeader) return;

            const columnIndex = Array.from(targetHeader.parentNode.children).indexOf(targetHeader);
            if (columnIndex === -1) return;

            rows.sort((a, b) => {
                const aCell = a.children[columnIndex];
                const bCell = b.children[columnIndex];
                if (!aCell || !bCell) return 0;

                const aText = aCell.dataset.value || aCell.textContent.trim();
                const bText = bCell.dataset.value || bCell.textContent.trim();

                const aNum = parseFloat(aText);
                const bNum = parseFloat(bText);

                let comparison = 0;
                if (!isNaN(aNum) && !isNaN(bNum)) {
                    comparison = aNum - bNum;
                } else {
                    comparison = aText.localeCompare(bText, undefined, {
                        sensitivity: 'base',
                        numeric: true
                    });
                }

                return reverse ? -comparison : comparison;
            });

            this.tbody.append(...rows);
        }
    }

    /**************************************************************
     *   TOAST NOTIFICATION MANAGER
     **************************************************************/
    class ToastNotificationManager {
        constructor() {
            this.activeToasts = [];
            this.toastQueue = [];
            this.maxConcurrentToasts = 5;
            this.toastSpacing = 10;
            this.minTimeBetweenToasts = 300;
            this.lastToastTime = 0;
            this.createToastContainer();
        }

        createToastContainer() {
            try {
                if (document.getElementById('hf-toast-container')) {
                    this.container = document.getElementById('hf-toast-container');
                    console.log('[ToastManager] Using existing container');
                    return;
                }

                const container = document.createElement('div');
                container.id = 'hf-toast-container';

                // Ensure container has proper CSS
                container.style.position = 'fixed';
                container.style.top = '20px';
                container.style.right = '20px';
                container.style.zIndex = '999999';
                container.style.pointerEvents = 'none';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.gap = '10px';
                container.style.maxWidth = '400px';

                // Try to append to hf-ui-root, wait if needed
                const appendToRoot = () => {
                    let uiRoot = document.getElementById('hf-ui-root');
                    if (uiRoot) {
                        uiRoot.appendChild(container);
                        this.container = container;
                        console.log('[ToastManager] Container created and appended to hf-ui-root');
                        return true;
                    }
                    return false;
                };

                if (!appendToRoot()) {
                    // Wait for hf-ui-root to be created
                    const checkRoot = setInterval(() => {
                        if (appendToRoot()) {
                            clearInterval(checkRoot);
                        }
                    }, 100);

                    // Fallback to body after 5 seconds
                    setTimeout(() => {
                        if (!this.container || !this.container.parentElement) {
                            clearInterval(checkRoot);
                            const fallbackRoot = document.getElementById('hf-ui-root') || document.body;
                            fallbackRoot.appendChild(container);
                            this.container = container;
                            console.warn('[ToastManager] Container appended to fallback root (body)');
                        }
                    }, 5000);
                }
            } catch (error) {
                console.error('[ToastManager] Error creating container:', error);
                // Create fallback container on body
                try {
                    const fallbackContainer = document.createElement('div');
                    fallbackContainer.id = 'hf-toast-container';
                    fallbackContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 999999; pointer-events: none; display: flex; flex-direction: column; gap: 10px; max-width: 400px;';
                    document.body.appendChild(fallbackContainer);
                    this.container = fallbackContainer;
                    console.warn('[ToastManager] Using fallback container on body');
                } catch (fallbackError) {
                    console.error('[ToastManager] Failed to create fallback container:', fallbackError);
                }
            }
        }

        removeToast(toastElement) {
            const index = this.activeToasts.findIndex(t => t.element === toastElement);
            if (index > -1) {
                const toast = this.activeToasts[index];
                if (toast.timeoutId) {
                    clearTimeout(toast.timeoutId);
                    toast.timeoutId = null;
                }
                this.activeToasts.splice(index, 1);

                if (this.toastQueue.length > 0 && this.activeToasts.length < this.maxConcurrentToasts) {
                    const queuedToast = this.toastQueue.shift();
                    this._showQueuedToast(queuedToast);
                }
            }
        }

        _showQueuedToast(toastConfig) {
            if (toastConfig.type === 'simple') {
                this._showSimpleToast(toastConfig.title, toastConfig.message, toastConfig.icon, toastConfig.iconColor, toastConfig.duration);
            } else if (toastConfig.type === 'alert') {
                this.alert(toastConfig.message, toastConfig.typeOrOptions, toastConfig.options);
            }
        }

        alert(message, typeOrOptions = {}, options = {}) {
            let type = 'info';
            let finalOptions = {};

            if (typeof typeOrOptions === 'string') {
                type = typeOrOptions;
                finalOptions = options || {};
            } else {
                finalOptions = typeOrOptions || {};
                type = finalOptions.type || 'info';
            }

            return new Promise((resolve) => {
                const typeConfigs = {
                    success: { icon: 'checkmark-circle', iconColor: 'var(--hf-success)', defaultDuration: 3000 },
                    error: { icon: 'close-circle', iconColor: 'var(--hf-error)', defaultDuration: 5000 },
                    warning: { icon: 'warning', iconColor: 'var(--hf-warning)', defaultDuration: 4000 },
                    info: { icon: 'information-circle', iconColor: 'var(--hf-info)', defaultDuration: 3000 }
                };

                const typeConfig = typeConfigs[type] || typeConfigs.info;

                const toastOptions = {
                    message: finalOptions.title || typeConfig.icon,
                    details: message,
                    icon: finalOptions.icon || typeConfig.icon,
                    iconColor: finalOptions.iconColor || typeConfig.iconColor,
                    autoHide: finalOptions.autoHide !== undefined ? finalOptions.autoHide : true,
                    autoHideDuration: finalOptions.duration || finalOptions.autoHideDuration || typeConfig.defaultDuration,
                    buttons: finalOptions.buttons || [{
                        text: 'OK',
                        className: 'hf-btn',
                        icon: 'checkmark',
                        onClick: () => resolve(true)
                    }],
                    onDismiss: () => {
                        if (toast && toast.element) {
                            this.removeToast(toast.element);
                        }
                        if (finalOptions.onDismiss) finalOptions.onDismiss();
                        resolve(true);
                    }
                };

                if (this.activeToasts.length >= this.maxConcurrentToasts) {
                    this.toastQueue.push({
                        type: 'alert',
                        message: message,
                        typeOrOptions: typeOrOptions,
                        options: options
                    });
                    return Promise.resolve(false);
                }

                const now = Date.now();
                const timeSinceLastToast = now - this.lastToastTime;

                let toast;
                const showToast = () => {
                    toast = this._createToast(toastOptions);
                    if (this.container && toast.element) {
                        if (toast.element.parentElement && toast.element.parentElement !== this.container) {
                            toast.element.parentElement.removeChild(toast.element);
                        }
                        this.container.appendChild(toast.element);
                    }

                    const originalDismiss = toast.dismiss;
                    toast.dismiss = () => {
                        this.removeToast(toast.element);
                        originalDismiss();
                    };

                    this.activeToasts.push(toast);
                    this.lastToastTime = Date.now();
                };

                if (timeSinceLastToast < this.minTimeBetweenToasts) {
                    setTimeout(showToast, this.minTimeBetweenToasts - timeSinceLastToast);
                } else {
                    showToast();
                }
            });
        }

        success(message, duration = 3000) {
            return this._showSimpleToast('Success', message, 'checkmark-circle', 'var(--hf-success)', duration);
        }

        error(message, duration = 5000) {
            return this._showSimpleToast('Error', message, 'close-circle', 'var(--hf-error)', duration);
        }

        warning(message, duration = 4000) {
            return this._showSimpleToast('Warning', message, 'warning', 'var(--hf-warning)', duration);
        }

        info(message, duration = 3000) {
            return this._showSimpleToast('Info', message, 'information-circle', 'var(--hf-info)', duration);
        }

        confirm(message, options = {}) {
            return new Promise((resolve) => {
                const defaultOptions = {
                    title: options.title || 'Confirm',
                    message: message,
                    confirmText: options.confirmText || 'Confirm',
                    cancelText: options.cancelText || 'Cancel',
                    confirmIcon: options.confirmIcon || 'checkmark',
                    cancelIcon: options.cancelIcon || 'close',
                    type: options.type || 'warning'
                };

                const typeConfigs = {
                    warning: { icon: 'warning', iconColor: 'var(--hf-warning)' },
                    danger: { icon: 'alert-circle', iconColor: 'var(--hf-error)' },
                    info: { icon: 'information-circle', iconColor: 'var(--hf-info)' }
                };

                const typeConfig = typeConfigs[defaultOptions.type] || typeConfigs.warning;

                const toastOptions = {
                    message: defaultOptions.title,
                    details: defaultOptions.message,
                    icon: typeConfig.icon,
                    iconColor: typeConfig.iconColor,
                    autoHide: false,
                    buttons: [
                        {
                            text: defaultOptions.cancelText,
                            className: 'hf-btn btn-secondary',
                            icon: defaultOptions.cancelIcon,
                            onClick: () => {
                                if (toast && toast.dismiss) {
                                    toast.dismiss();
                                }
                                resolve(false);
                            }
                        },
                        {
                            text: defaultOptions.confirmText,
                            className: 'hf-btn btn-primary',
                            icon: defaultOptions.confirmIcon,
                            onClick: () => {
                                if (toast && toast.dismiss) {
                                    toast.dismiss();
                                }
                                resolve(true);
                            }
                        }
                    ],
                    onDismiss: () => {
                        if (toast && toast.element) {
                            this.removeToast(toast.element);
                        }
                        resolve(false);
                    }
                };

                if (this.activeToasts.length >= this.maxConcurrentToasts) {
                    this.toastQueue.push({
                        type: 'confirm',
                        message: message,
                        options: options
                    });
                    return Promise.resolve(false);
                }

                const toast = this._createToast(toastOptions);
                if (this.container && toast.element) {
                    if (toast.element.parentElement && toast.element.parentElement !== this.container) {
                        toast.element.parentElement.removeChild(toast.element);
                    }
                    this.container.appendChild(toast.element);
                }

                const originalDismiss = toast.dismiss;
                toast.dismiss = () => {
                    this.removeToast(toast.element);
                    originalDismiss();
                };

                this.activeToasts.push(toast);
                this.lastToastTime = Date.now();
            });
        }

        _showSimpleToast(title, message, icon, iconColor, duration) {
            try {
                console.log('[ToastManager] _showSimpleToast called:', title, message);

                if (this.activeToasts.length >= this.maxConcurrentToasts) {
                    console.log('[ToastManager] Queueing toast (max concurrent reached)');
                    this.toastQueue.push({
                        type: 'simple',
                        title: title,
                        message: message,
                        icon: icon,
                        iconColor: iconColor,
                        duration: duration
                    });
                    return { element: null, dismiss: () => { } };
                }

                const toast = this._createToast({
                    message: title,
                    details: message,
                    icon: icon,
                    iconColor: iconColor,
                    autoHide: true,
                    autoHideDuration: duration,
                    onDismiss: () => {
                        if (toast.element) {
                            this.removeToast(toast.element);
                        }
                    }
                });

                if (!toast.element) {
                    console.error('[ToastManager] Toast element not created');
                    return toast;
                }

                // Ensure container exists
                if (!this.container) {
                    console.warn('[ToastManager] No container, recreating...');
                    this.createToastContainer();
                }

                if (this.container && toast.element && !toast.element.parentElement) {
                    this.container.appendChild(toast.element);
                    console.log('[ToastManager] Toast appended to container');
                }

                const originalDismiss = toast.dismiss;
                toast.dismiss = () => {
                    if (toast.element) {
                        this.removeToast(toast.element);
                    }
                    if (originalDismiss) originalDismiss();
                };

                this.activeToasts.push(toast);
                console.log('[ToastManager] Toast added to active toasts, count:', this.activeToasts.length);
                return toast;
            } catch (error) {
                console.error('[ToastManager] Error in _showSimpleToast:', error);
                const fallbackMsg = `${title}: ${message}`;
                console.log(`[Toast Fallback] ${fallbackMsg}`);
                return { element: null, dismiss: () => { } };
            }
        }

        _createToast(options) {
            try {
                console.log('[ToastManager] Creating toast:', options.message || options.details || 'No message');

                if (!this.container) {
                    console.warn('[ToastManager] No container, recreating...');
                    this.createToastContainer();
                }

                if (!this.container) {
                    console.error('[ToastManager] Cannot create toast - no container available');
                    // Fallback to console
                    const message = options.details || options.message || 'Notification';
                    console.log(`[Toast] ${options.message || ''}: ${message}`);
                    return { element: null, dismiss: () => { } };
                }

                const toast = document.createElement('div');
                toast.className = 'hf-toast';
                toast.style.cssText = 'pointer-events: auto; background: rgba(0, 0, 0, 0.9); color: white; padding: 12px 16px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); min-width: 300px; max-width: 400px; opacity: 0; transform: translateX(100%); transition: all 0.3s ease;';

                const header = document.createElement('div');
                header.className = 'hf-toast-header';

                if (options.icon) {
                    const iconEl = createIcon(options.icon);
                    iconEl.style.color = options.iconColor || 'var(--hf-info)';
                    iconEl.className = 'hf-toast-icon';
                    header.appendChild(iconEl);
                }

                if (options.message) {
                    const titleEl = document.createElement('strong');
                    titleEl.textContent = options.message;
                    header.appendChild(titleEl);
                }

                toast.appendChild(header);

                if (options.details) {
                    const messageEl = document.createElement('div');
                    messageEl.className = 'hf-toast-message';
                    messageEl.textContent = options.details;
                    toast.appendChild(messageEl);
                }

                if (options.buttons && options.buttons.length > 0) {
                    const buttonsEl = document.createElement('div');
                    buttonsEl.className = 'hf-toast-buttons';
                    options.buttons.forEach(btnConfig => {
                        const btn = document.createElement('button');
                        btn.className = btnConfig.className || 'hf-btn';
                        if (btnConfig.icon) {
                            btn.appendChild(createIcon(btnConfig.icon));
                        }
                        if (btnConfig.text) {
                            const span = document.createElement('span');
                            span.textContent = btnConfig.text;
                            btn.appendChild(span);
                        }
                        btn.onclick = () => {
                            if (btnConfig.onClick) btnConfig.onClick();
                            if (options.autoHide !== false) {
                                toast.dismiss();
                            }
                        };
                        buttonsEl.appendChild(btn);
                    });
                    toast.appendChild(buttonsEl);
                }

                const closeBtn = document.createElement('button');
                closeBtn.className = 'hf-toast-close';
                closeBtn.setAttribute('aria-label', 'Close');
                closeBtn.appendChild(createIcon('close', '12px'));
                closeBtn.onclick = (e) => {
                    e.stopPropagation();
                    dismiss();
                };
                header.appendChild(closeBtn);

                let timeoutId = null;
                const dismiss = () => {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }

                    toast.classList.remove('visible');
                    setTimeout(() => {
                        if (toast.parentElement) {
                            toast.parentElement.removeChild(toast);
                        }
                        if (options.onDismiss) options.onDismiss();
                    }, 150);
                };

                toast.dismiss = dismiss;

                requestAnimationFrame(() => {
                    toast.classList.add('visible');
                });

                if (options.autoHide !== false) {
                    timeoutId = setTimeout(dismiss, options.autoHideDuration || 3000);
                }

                return { element: toast, dismiss: dismiss, timeoutId: timeoutId };
            } catch (error) {
                console.error('[ToastManager] Error creating toast:', error);
                const message = options.details || options.message || 'Notification';
                console.log(`[Toast Fallback] ${options.message || ''}: ${message}`);
                return { element: null, dismiss: () => { }, timeoutId: null };
            }
        }
    }

    // Initialize toast manager
    const toastManager = new ToastNotificationManager();
    window.toastManager = toastManager;
    window.toastSuccess = (msg, dur) => toastManager.success(msg, dur);
    window.toastError = (msg, dur) => toastManager.error(msg, dur);
    window.toastWarning = (msg, dur) => toastManager.warning(msg, dur);
    window.toastInfo = (msg, dur) => toastManager.info(msg, dur);
    window.toastConfirm = (msg, opts) => toastManager.confirm(msg, opts);
    window.confirmAction = function (message, onConfirm, onCancel, options = {}) {
        toastManager.confirm(message, options).then(result => {
            if (result && onConfirm) {
                onConfirm();
            } else if (!result && onCancel) {
                onCancel();
            }
        });
    };

    /**************************************************************
     *   TOOLTIP MANAGER
     **************************************************************/
    class TooltipManager {
        constructor() {
            this.tooltipEl = null;
            this.arrowEl = null;
            this.contentEl = null;
            this.currentTarget = null;
            this.enabled = true;
            this.showTimeout = null;
            this.hideTimeout = null;
            this.isVisible = false;

            this.CONFIG = {
                MAX_WIDTH: 320,
                MIN_WIDTH: 120,
                ARROW_SIZE: 8,
                SPACING: 10,
                PADDING: 12,
                SHOW_DELAY: 120,
                HIDE_DELAY: 80
            };

            this.scopeSelectors = '#hf-ui-root, #hf-panel, .hf-panel, .hf-modal-overlay, .hf-bulk-content';
            this._createTooltip();
            this._attachEvents();
        }

        _createTooltip() {
            let existingTooltip = document.getElementById('hf-tooltip-container');
            if (existingTooltip) {
                this.tooltipEl = existingTooltip;
                this.contentEl = existingTooltip.querySelector('#hf-tooltip-content');
                this.arrowEl = existingTooltip.querySelector('#hf-tooltip-arrow');
                return;
            }

            this.tooltipEl = document.createElement('div');
            this.tooltipEl.id = 'hf-tooltip-container';
            this.tooltipEl.setAttribute('role', 'tooltip');

            this.contentEl = document.createElement('div');
            this.contentEl.id = 'hf-tooltip-content';

            this.arrowEl = document.createElement('div');
            this.arrowEl.id = 'hf-tooltip-arrow';

            this.tooltipEl.append(this.contentEl, this.arrowEl);

            // Ensure tooltip container is appended to hf-ui-root
            const appendToRoot = () => {
                let uiRoot = document.getElementById('hf-ui-root');
                if (uiRoot) {
                    uiRoot.appendChild(this.tooltipEl);
                    console.log('[TooltipManager] Tooltip container appended to hf-ui-root');
                    return true;
                }
                return false;
            };

            // Try immediately
            if (!appendToRoot()) {
                // Wait for hf-ui-root to be created (it's created in buildUI)
                const checkRoot = setInterval(() => {
                    if (appendToRoot()) {
                        clearInterval(checkRoot);
                    }
                }, 100);
                // Fallback to body after 5 seconds if hf-ui-root never appears
                setTimeout(() => {
                    if (!this.tooltipEl.parentElement) {
                        clearInterval(checkRoot);
                        const fallbackRoot = document.getElementById('hf-ui-root') || document.body;
                        fallbackRoot.appendChild(this.tooltipEl);
                        console.log('[TooltipManager] Tooltip container appended to fallback root');
                    }
                }, 5000);
            }
        }

        _attachEvents() {
            // Use event delegation to handle dynamically added elements
            const handleMouseEnter = (e) => {
                if (!this.enabled) return;

                // Ensure e.target is an Element (not a Text node or other node type)
                if (!e.target || typeof e.target.closest !== 'function') return;

                const target = e.target.closest('[data-tooltip]');
                if (!target) return;

                // Check if target is within our scope (allow all elements, not just within specific selectors)
                // This ensures tooltips work on dynamically added content
                if (this.hideTimeout) {
                    clearTimeout(this.hideTimeout);
                    this.hideTimeout = null;
                }

                if (this.showTimeout) clearTimeout(this.showTimeout);
                this.showTimeout = setTimeout(() => {
                    this._show(target);
                    this.showTimeout = null;
                }, this.CONFIG.SHOW_DELAY);
            };

            const handleMouseLeave = (e) => {
                if (!this.enabled || !this.currentTarget) return;

                // Ensure e.target is an Element
                if (!e.target || typeof e.target.closest !== 'function') {
                    this._scheduleHide();
                    return;
                }

                const target = e.target.closest('[data-tooltip]');

                // Check e.relatedTarget safely
                const relatedTarget = e.relatedTarget && typeof e.relatedTarget.closest === 'function'
                    ? e.relatedTarget.closest('[data-tooltip]')
                    : null;

                if (target === this.currentTarget || !relatedTarget) {
                    this._scheduleHide();
                }
            };

            // Use capture phase and attach to document for better coverage
            document.addEventListener('mouseenter', handleMouseEnter, true);
            document.addEventListener('mouseleave', handleMouseLeave, true);
            document.addEventListener('mouseover', handleMouseEnter, true);
            document.addEventListener('mouseout', handleMouseLeave, true);

            if (this.tooltipEl) {
                this.tooltipEl.addEventListener('mouseleave', () => this._hide(), true);
                this.tooltipEl.addEventListener('pointerleave', () => this._hide(), true);
            }

            document.addEventListener('scroll', () => this._hide(), { passive: true, capture: true });
            document.addEventListener('mousedown', (e) => {
                if (this.tooltipEl && !this.tooltipEl.contains(e.target)) {
                    this._hide();
                }
            }, { passive: true, capture: true });
        }

        _show(target) {
            if (target === this.currentTarget && this.isVisible) return;
            this.currentTarget = target;

            const content = target.dataset.tooltip;
            if (!content) {
                this._hide();
                return;
            }

            this.contentEl.textContent = content;
            this._position(target);

            requestAnimationFrame(() => {
                this.tooltipEl.classList.add('hf-tooltip-visible');
                this.isVisible = true;
            });
        }

        _hide() {
            if (this.showTimeout) {
                clearTimeout(this.showTimeout);
                this.showTimeout = null;
            }
            this._clearHideTimeout();

            this.tooltipEl.classList.remove('hf-tooltip-visible');
            this.currentTarget = null;
            this.isVisible = false;
        }

        _clearHideTimeout() {
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
                this.hideTimeout = null;
            }
        }

        _scheduleHide() {
            this._clearHideTimeout();
            this.hideTimeout = setTimeout(() => {
                this._hide();
                this.hideTimeout = null;
            }, this.CONFIG.HIDE_DELAY);
        }

        _position(target) {
            const tRect = target.getBoundingClientRect();

            this.tooltipEl.style.visibility = 'hidden';
            this.tooltipEl.style.display = 'block';
            this.tooltipEl.style.maxWidth = `${Math.max(this.CONFIG.MIN_WIDTH, Math.min(this.CONFIG.MAX_WIDTH, window.innerWidth - this.CONFIG.PADDING * 2))}px`;
            const ttRect = this.tooltipEl.getBoundingClientRect();

            const space = {
                top: tRect.top - this.CONFIG.PADDING,
                bottom: window.innerHeight - tRect.bottom - this.CONFIG.PADDING,
                left: tRect.left - this.CONFIG.PADDING,
                right: window.innerWidth - tRect.right - this.CONFIG.PADDING
            };

            const placement = this._choosePlacement(target, space, ttRect);
            const pos = this._calculatePosition(placement, tRect, ttRect);

            const x = Math.round(pos.x);
            const y = Math.round(pos.y);

            this.tooltipEl.style.transform = `translate(${x}px, ${y}px)`;
            this.tooltipEl.style.visibility = '';
            this.tooltipEl.style.display = '';

            this.tooltipEl.classList.remove('hf-placement-top', 'hf-placement-bottom', 'hf-placement-left', 'hf-placement-right');
            this.tooltipEl.classList.add(`hf-placement-${placement}`);

            this._positionArrow(placement, tRect, { x, y }, ttRect);
        }

        _choosePlacement(target, space, ttRect) {
            const preferTop = target.dataset.tooltipPlacement === 'top';

            if (preferTop && space.top >= ttRect.height + this.CONFIG.SPACING) return 'top';

            const fitsTop = space.top >= ttRect.height + this.CONFIG.SPACING;
            const fitsBottom = space.bottom >= ttRect.height + this.CONFIG.SPACING;
            const fitsRight = space.right >= ttRect.width + this.CONFIG.SPACING;
            const fitsLeft = space.left >= ttRect.width + this.CONFIG.SPACING;

            if (fitsTop) return 'top';
            if (fitsBottom) return 'bottom';
            if (fitsRight) return 'right';
            if (fitsLeft) return 'left';

            const candidates = [
                { dir: 'top', val: space.top },
                { dir: 'bottom', val: space.bottom },
                { dir: 'right', val: space.right },
                { dir: 'left', val: space.left }
            ];
            candidates.sort((a, b) => b.val - a.val);
            return candidates[0].dir;
        }

        _calculatePosition(placement, tRect, ttRect) {
            const pos = { x: 0, y: 0 };
            const minX = this.CONFIG.PADDING;
            const maxX = window.innerWidth - this.CONFIG.PADDING - ttRect.width;
            const minY = this.CONFIG.PADDING;
            const maxY = window.innerHeight - this.CONFIG.PADDING - ttRect.height;

            const centerX = tRect.left + tRect.width / 2;
            const centerY = tRect.top + tRect.height / 2;

            if (placement === 'top' || placement === 'bottom') {
                pos.y = placement === 'top'
                    ? tRect.top - ttRect.height - this.CONFIG.SPACING
                    : tRect.bottom + this.CONFIG.SPACING;
                pos.y = Math.max(minY, Math.min(maxY, pos.y));
                pos.x = centerX - ttRect.width / 2;
                pos.x = Math.max(minX, Math.min(maxX, pos.x));
            } else {
                pos.x = placement === 'left'
                    ? tRect.left - ttRect.width - this.CONFIG.SPACING
                    : tRect.right + this.CONFIG.SPACING;
                pos.x = Math.max(minX, Math.min(maxX, pos.x));
                pos.y = centerY - ttRect.height / 2;
                pos.y = Math.max(minY, Math.min(maxY, pos.y));
            }

            return pos;
        }

        _positionArrow(placement, tRect, ttPos, ttRect) {
            const centerX = tRect.left + tRect.width / 2;
            const centerY = tRect.top + tRect.height / 2;
            const arrow = this.CONFIG.ARROW_SIZE;

            if (placement === 'top' || placement === 'bottom') {
                let x = centerX - ttPos.x - arrow;
                x = Math.max(arrow, Math.min(ttRect.width - arrow * 3, x));
                this.arrowEl.style.left = `${x}px`;
                this.arrowEl.style.top = '';
            } else {
                let y = centerY - ttPos.y - arrow;
                y = Math.max(arrow, Math.min(ttRect.height - arrow * 3, y));
                this.arrowEl.style.top = `${y}px`;
                this.arrowEl.style.left = '';
            }
        }

        enable() {
            this.enabled = true;
        }

        disable() {
            this.enabled = false;
            this._hide();
        }

        toggle() {
            this.enabled ? this.disable() : this.enable();
            return this.enabled;
        }
    }

    // Initialize tooltip manager
    const tooltipManager = new TooltipManager();
    window.tooltipManager = tooltipManager;

    /**************************************************************
     *   PANEL DRAG & MINIMIZE FUNCTIONALITY
     **************************************************************/
    function setupPanelDragAndMinimize(panel) {
        const header = panel.querySelector('#hf-header');
        if (!header) return;

        // Minimize functionality
        const minimizeBtn = header.querySelector('.hf-header-btn[data-tooltip="Minimize Panel"]');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                panel.classList.toggle('minimized');
                const icon = minimizeBtn.querySelector('ion-icon');
                if (icon) {
                    icon.setAttribute('name', panel.classList.contains('minimized') ? 'add' : 'remove');
                }
                // Save minimized state
                const settings = HFStorage.getSettings();
                settings.panelMinimized = panel.classList.contains('minimized');
                HFStorage.saveSettings(settings);
            });
        }

        // Draggable functionality
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        let xOffset = 0, yOffset = 0;

        // Restore panel position from settings
        const settings = HFStorage.getSettings();
        if (settings.panelPosition) {
            panel.style.left = settings.panelPosition.left + 'px';
            panel.style.top = settings.panelPosition.top + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            xOffset = settings.panelPosition.left;
            yOffset = settings.panelPosition.top;
        }

        // Restore minimized state
        if (settings.panelMinimized) {
            panel.classList.add('minimized');
            const icon = minimizeBtn?.querySelector('ion-icon');
            if (icon) icon.setAttribute('name', 'add');
        }

        const dragStart = (e) => {
            if (e.target.closest('button') || e.target.closest('.hf-header-btn')) return;
            // Allow dragging even when minimized - just adjust constraints

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
                panel.classList.add('dragging');
            }
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            // Constrain to viewport
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;
            xOffset = Math.max(0, Math.min(xOffset, maxX));
            yOffset = Math.max(0, Math.min(yOffset, maxY));

            panel.style.left = xOffset + 'px';
            panel.style.top = yOffset + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        };

        const dragEnd = () => {
            if (isDragging) {
                isDragging = false;
                panel.classList.remove('dragging');

                // Save position
                const settings = HFStorage.getSettings();
                settings.panelPosition = { left: xOffset, top: yOffset };
                HFStorage.saveSettings(settings);
            }
        };

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
    }

    /**************************************************************
     *   BUTTON ICON SYSTEM
     **************************************************************/
    const BUTTON_ICONS = {
        'hf-btn-dashboard': 'grid',
        'hf-btn-start': 'sparkles',
        'hf-btn-pause': 'pause',
        'hf-btn-stop': 'stop',
        'hf-btn-match-videos': 'git-compare',
        'hf-btn-import-csv': 'cloud-upload',
        'hf-btn-export': 'download',
        'hf-btn-clear': 'trash'
    };

    function initializeButtonIcons() {
        Object.entries(BUTTON_ICONS).forEach(([id, iconName]) => {
            const btn = document.getElementById(id);
            if (btn && !btn.querySelector('ion-icon')) {
                const icon = createIcon(iconName, '14px');
                btn.insertBefore(icon, btn.firstChild);
                if (btn.textContent.trim()) {
                    btn.insertBefore(document.createTextNode(' '), icon.nextSibling);
                }
            }
        });
    }

    /**************************************************************
     *   BUTTON STATE MANAGEMENT
     **************************************************************/
    function updateButtonStates() {
        const startBtn = document.getElementById('hf-btn-start');
        const pauseBtn = document.getElementById('hf-btn-pause');
        const stopBtn = document.getElementById('hf-btn-stop');

        if (!startBtn || !pauseBtn || !stopBtn) return;

        const isRunning = STATE.isProcessing && !STATE.isPaused;
        const isPaused = STATE.isProcessing && STATE.isPaused;
        const hasPendingItems = STATE.queue.some(item => item.status === 'Pending');
        const hasQueue = STATE.queue.length > 0;

        // Check if textarea has content
        const textarea = document.getElementById('hf-input');
        const hasTextareaContent = textarea && textarea.value.trim().length > 0;

        // Start button: add/remove loading class only when actually running
        if (isRunning) {
            startBtn.classList.add('loading');
        } else {
            startBtn.classList.remove('loading');
        }
        // Disable start button when running or when there's nothing to process
        startBtn.disabled = isRunning || (!hasPendingItems && !hasTextareaContent);


        // Pause button: add/remove loading class and disable when not processing
        if (!STATE.isProcessing) {
            pauseBtn.classList.add('loading');
            console.log('[updateButtonStates] Pause button: loading state (not processing)');
        } else {
            pauseBtn.classList.remove('loading');
            console.log('[updateButtonStates] Pause button: active state');
        }
        pauseBtn.disabled = !STATE.isProcessing;

        const pauseIcon = pauseBtn.querySelector('ion-icon');
        const pauseText = pauseBtn.querySelector('.btn-label') || pauseBtn.querySelector('span:not(.hf-icon)');
        if (pauseIcon) {
            if (isPaused) {
                pauseIcon.setAttribute('name', 'play');
                if (pauseText) pauseText.textContent = 'Resume';
                pauseBtn.setAttribute('data-tooltip', 'Resume queue');
            } else {
                pauseIcon.setAttribute('name', 'pause');
                if (pauseText) pauseText.textContent = 'Pause';
                pauseBtn.setAttribute('data-tooltip', 'Pause queue');
            }
        }
        // Stop button: add/remove loading class and disable when not processing
        if (!STATE.isProcessing) {
            stopBtn.classList.add('loading');
            console.log('[updateButtonStates] Stop button: loading state (not processing)');
        } else {
            stopBtn.classList.remove('loading');
            console.log('[updateButtonStates] Stop button: active state');
        }
        stopBtn.disabled = !STATE.isProcessing;

        console.log('[updateButtonStates] Button states updated - isRunning:', isRunning, 'isPaused:', isPaused, 'hasPendingItems:', hasPendingItems, 'hasTextareaContent:', hasTextareaContent);
    }

    /**************************************************************
     *   WORKFLOW LOGGER
     **************************************************************/
    const WorkflowLogger = {
        logs: [],
        maxLogs: 1000,

        init() {
            // Load persisted logs
            try {
                const stored = HFStorage.getWorkflowLog();
                if (Array.isArray(stored) && stored.length > 0) {
                    this.logs = stored;
                    // Filter out duplicate "Loaded" messages
                    const filteredLogs = [];
                    let lastMessage = null;
                    this.logs.forEach(entry => {
                        if (entry.message && entry.message.includes('Loaded') && entry.message === lastMessage) {
                            return; // Skip duplicate
                        }
                        filteredLogs.push(entry);
                        lastMessage = entry.message;
                    });
                    this.logs = filteredLogs;
                    this.render();
                }
            } catch (e) {
                console.error('[WorkflowLogger] Failed to load logs:', e);
            }
        },

        addLog(type, message, data = null) {
            const entry = {
                timestamp: Date.now(),
                type, // 'info', 'success', 'warning', 'error'
                message,
                data
            };

            this.logs.push(entry);
            if (this.logs.length > this.maxLogs) {
                this.logs.shift();
            }

            // Persist to storage
            HFStorage.saveWorkflowLog(this.logs);

            // Render to UI
            this.render();

            // Console output
            const consoleMethod = type === 'error' ? 'error' : type === 'warning' ? 'warn' : 'log';
            const prefix = `[${type.toUpperCase()}]`;
            if (data) {
                console[consoleMethod](prefix, message, data);
            } else {
                console[consoleMethod](prefix, message);
            }
        },

        render() {
            const logArea = document.getElementById('hf-log-area');
            if (!logArea) {
                console.warn('[WorkflowLogger] #hf-log-area not found');
                return;
            }

            logArea.innerHTML = '';

            if (this.logs.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.className = 'hf-log-entry log-info';
                emptyMsg.textContent = 'No log entries yet. Activity will appear here.';
                logArea.appendChild(emptyMsg);
                return;
            }

            // Filter consecutive duplicate "Loaded" messages during render
            const filteredLogs = [];
            let lastMessage = null;
            this.logs.forEach(entry => {
                if (entry.message && entry.message.includes('Loaded') && entry.message === lastMessage) {
                    return; // Skip duplicate
                }
                filteredLogs.push(entry);
                lastMessage = entry.message;
            });

            filteredLogs.forEach(entry => {
                const logEntry = document.createElement('div');
                logEntry.className = `hf-log-entry log-${entry.type}`;

                // Create timestamp span
                const timeSpan = document.createElement('span');
                timeSpan.className = 'hf-log-time';
                timeSpan.textContent = `[${new Date(entry.timestamp).toLocaleTimeString()}] `;

                // Create content span with truncation - make it clickable
                const contentSpan = document.createElement('span');
                contentSpan.className = 'hf-log-content clamped';

                let messageText = entry.message || '';
                if (entry.data) {
                    messageText += ` | ${JSON.stringify(entry.data)}`;
                }
                contentSpan.textContent = messageText;

                // Check if content needs truncation (rough estimate: ~100 chars per line)
                const estimatedLines = Math.ceil(messageText.length / 100);
                if (estimatedLines > 2) {
                    // Content will be truncated by default (line-clamp: 2)
                    // Clicking will remove line-clamp to show full content
                    contentSpan.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (contentSpan.classList.contains('clamped') || contentSpan.style.webkitLineClamp === '2') {
                            // Expand
                            contentSpan.classList.remove('clamped');
                            console.log('[Log] Expanded log entry');
                        } else {
                            // Collapse
                            contentSpan.classList.add('clamped');
                            console.log('[Log] Collapsed log entry');
                        }
                    });
                }

                logEntry.appendChild(timeSpan);
                logEntry.appendChild(contentSpan);
                logArea.appendChild(logEntry);
            });

            // Auto-scroll to bottom
            logArea.scrollTop = logArea.scrollHeight;
        },

        copyLog() {
            // Export plain text without HTML markup
            const text = this.logs.map(entry => {
                const time = new Date(entry.timestamp).toLocaleString();
                return `[${time}] [${entry.type.toUpperCase()}] ${entry.message}`;
            }).join('\n');

            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(text);
                toastManager.success('Log copied to clipboard');
            } else {
                navigator.clipboard.writeText(text).then(() => {
                    toastManager.success('Log copied to clipboard');
                }).catch(() => {
                    toastManager.error('Failed to copy log');
                });
            }
        },

        downloadLog() {
            const text = this.logs.map(entry => {
                const time = new Date(entry.timestamp).toLocaleString();
                return `[${time}] [${entry.type.toUpperCase()}] ${entry.message}`;
            }).join('\n');

            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `higgsfield-workflow-log-${Date.now()}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            toastManager.success('Log downloaded');
        },

        clearLog() {
            toastManager.confirm('Are you sure you want to clear the workflow log?', {
                title: 'Clear Workflow Log',
                type: 'warning'
            }).then(confirmed => {
                if (confirmed) {
                    this.logs = [];
                    HFStorage.saveWorkflowLog([]);
                    this.render();
                    toastManager.success('Log cleared');
                }
            }).catch(error => {
                console.error('[WorkflowLogger] Error clearing log:', error);
            });
        }
    };

    // Convenience functions
    function logInfo(message, data) { WorkflowLogger.addLog('info', message, data); }
    function logSuccess(message, data) { WorkflowLogger.addLog('success', message, data); }
    function logWarning(message, data) { WorkflowLogger.addLog('warning', message, data); }
    function logError(message, data) { WorkflowLogger.addLog('error', message, data); }

    /**************************************************************
     *   CLEAR QUEUE FUNCTION
     **************************************************************/
    function clearQueue() {
        console.log('[clearQueue] Function called');
        console.log('[clearQueue] Current state - isProcessing:', STATE.isProcessing, 'queue length:', STATE.queue.length);
        logInfo('clearQueue() called');

        if (STATE.isProcessing) {
            logWarning('Cannot clear queue while processing. Stop the queue first.');
            toastManager.warning('Cannot clear queue while processing. Stop the queue first.');
            return;
        }

        toastManager.confirm('Are you sure you want to clear all imported data? This cannot be undone.', {
            title: 'Clear All Data',
            type: 'danger'
        }).then(confirmed => {
            console.log('[clearQueue] User confirmed:', confirmed);
            if (!confirmed) {
                logInfo('Clear queue cancelled by user');
                return;
            }

            try {
                logInfo('Clearing queue and all related data...');

                // Clear queue
                STATE.queue = [];
                HFStorage.saveQueue([]);
                console.log('[clearQueue] Queue cleared and saved');

                // Clear mapping
                HFStorage.saveMapping({});
                STATE.generationMap.clear();
                console.log('[clearQueue] Mapping cleared');

                // Clear downloaded files tracking
                try {
                    GM_setValue(GM_KEYS.DOWNLOADED_FILES, '[]');
                    console.log('[clearQueue] Downloaded files tracking cleared');
                } catch (e) {
                    console.error('[clearQueue] Error clearing downloaded files:', e);
                }

                // Clear local video IDs
                localVideoIdsSet.clear();
                console.log('[clearQueue] Local video IDs cleared');

                // Clear UI
                const tbody = document.querySelector('#hf-log-table tbody');
                if (tbody) {
                    tbody.innerHTML = '';
                    console.log('[clearQueue] Table log cleared');
                }

                const textarea = document.getElementById('hf-input');
                if (textarea) {
                    textarea.value = '';
                    console.log('[clearQueue] Main textarea cleared');
                }

                // Clear dashboard textarea if it exists
                const dashboardTextarea = document.getElementById('hf-dashboard-input');
                if (dashboardTextarea) {
                    dashboardTextarea.value = '';
                    console.log('[clearQueue] Dashboard textarea cleared');
                }

                updateStatus('Idle');
                updateButtonStates();

                // Update dashboard if open
                if (window.updateDashboardTable) {
                    window.updateDashboardTable();
                    console.log('[clearQueue] Dashboard table updated');
                }

                logSuccess('Queue and all related data cleared');
                toastManager.success('Queue cleared');
                console.log('[clearQueue] Clear operation completed successfully');
            } catch (error) {
                console.error('[clearQueue] Error during clear:', error);
                logError('Error clearing queue:', error);
                toastManager.error('Failed to clear queue: ' + error.message);
            }
        });
    }

    /*** cancelImport — clears dashboard CSV input & textarea and imported queue data ***/
    function cancelImport() {
        console.log('[cancelImport] Function called');
        const textarea = document.getElementById('hf-dashboard-input');
        const fileInput = document.getElementById('hf-dashboard-csv-input');
        const mainTextarea = document.getElementById('hf-input');
        console.log('[cancelImport] Elements found - dashboard textarea:', !!textarea, 'fileInput:', !!fileInput, 'main textarea:', !!mainTextarea);
        if (textarea) textarea.value = '';
        if (fileInput) fileInput.value = '';
        // Also clear the main-panel textarea
        if (mainTextarea) mainTextarea.value = '';

        // Clear imported queue data (items that were imported but not yet processed)
        const importedCount = STATE.queue.length;
        STATE.queue = STATE.queue.filter(item => {
            // Keep items that have been processed (have cellId, videoUrl, or are in progress)
            return item.cellId || item.videoUrl || item.status === 'Generating' || item.status === 'Success';
        });
        const clearedCount = importedCount - STATE.queue.length;
        HFStorage.saveQueue(STATE.queue);

        console.log('[cancelImport] All inputs cleared, cleared', clearedCount, 'imported items');
        toastManager.info('Import cancelled');
        if (clearedCount > 0) {
            toastManager.success(`Cleared ${clearedCount} imported item(s)`);
        }
    }

    /*** clearAllHistory — wipes persisted history array ***/
    function clearAllHistory() {
        console.log('[clearAllHistory] Function called');
        console.log('[clearAllHistory] Current history length:', STATE.history?.length || 0);
        logInfo('clearAllHistory() called');

        toastManager.confirm('Are you sure you want to clear all history? This cannot be undone.', {
            title: 'Clear All History',
            type: 'danger'
        }).then(confirmed => {
            console.log('[clearAllHistory] User confirmed:', confirmed);
            if (!confirmed) {
                logInfo('Clear history cancelled by user');
                return;
            }

            try {
                logInfo('Clearing all history...');

                // Clear history
                HFStorage.saveHistory([]);
                console.log('[clearAllHistory] History cleared and saved');
                if (STATE.history) {
                    STATE.history = [];
                }

                // Also clear download log and workflow log
                try {
                    GM_setValue(GM_KEYS.DOWNLOAD_LOG, '[]');
                    console.log('[clearAllHistory] Download log cleared');
                } catch (e) {
                    console.error('[clearAllHistory] Error clearing download log:', e);
                }

                WorkflowLogger.logs = [];
                HFStorage.saveWorkflowLog([]);
                WorkflowLogger.render();
                console.log('[clearAllHistory] Workflow log cleared');

                logSuccess('All history cleared (history, download log, workflow log)');
                toastManager.success('History cleared');

                if (window.updateDashboardTable) {
                    window.updateDashboardTable();
                    console.log('[clearAllHistory] Dashboard table updated');
                }
                console.log('[clearAllHistory] Clear operation completed successfully');
            } catch (error) {
                console.error('[clearAllHistory] Error during clear:', error);
                logError('Error clearing history:', error);
                toastManager.error('Failed to clear history: ' + error.message);
            }
        });
    }

    // --- UI BUILDER ---
    function buildUI() {
        if (document.getElementById('hf-panel')) {
            // UI already exists, just update button states
            updateButtonStates();
            return;
        }

        // Create #hf-ui-root wrapper for CSS isolation
        let uiRoot = document.getElementById('hf-ui-root');
        if (!uiRoot) {
            uiRoot = document.createElement('div');
            uiRoot.id = 'hf-ui-root';
            document.body.appendChild(uiRoot);
        }

        // Ensure tooltip container is moved to hf-ui-root if it exists elsewhere
        const tooltipContainer = document.getElementById('hf-tooltip-container');
        if (tooltipContainer && tooltipContainer.parentElement !== uiRoot) {
            uiRoot.appendChild(tooltipContainer);
            console.log('[buildUI] Moved tooltip container to hf-ui-root');
        }

        const panel = document.createElement('div');
        panel.id = 'hf-panel';
        panel.innerHTML = `

            <div class="hf-header" id="hf-header">
              <span class="hf-version">v${SCRIPT_VERSION}</span>
              <div class="hf-header-left">
                <img src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://higgsfield.ai&size=64" class="hf-icon hf-band hf-logo" alt="${SCRIPT_NAME}" />
                 <h3 class="header-title">${SCRIPT_NAME}</h3>
              </div>
              <div class="hf-header-right">

                <button class="hf-header-btn hide" data-tooltip="Toggle Tooltips">
                  <ion-icon name="checkmark" class="hf-icon md hydrated" aria-hidden="true" style="font-size: 12px;" role="img"></ion-icon>
                </button>

                <button class="hf-header-btn" data-tooltip="Help &amp; Instructions">
                  <ion-icon name="help-circle" class="hf-icon md hydrated" aria-hidden="true" style="font-size: 12px;" role="img"></ion-icon>
                </button>

                <button class="hf-header-btn" data-tooltip="Settings">
                  <ion-icon name="settings" class="hf-icon md hydrated" aria-hidden="true" style="font-size: 12px;" role="img"></ion-icon>
                </button>
                <button class="hf-header-btn" data-tooltip="Minimize Panel">
                  <ion-icon name="remove" class="hf-icon md hydrated" aria-hidden="true" role="img"></ion-icon>
                </button>
              </div>
            </div>
            <div class="hf-controls">
              <div class="button-row">
                  <div class="button-group">
                    <button id="hf-btn-dashboard" class="hf-btn btn-info" data-tooltip="View Dashboard and manage queue items"><span class="btn-label">Dashboard</span></button>
                    <button id="hf-btn-prefetch" class="hf-btn btn-secondary" data-tooltip="Pre-fetch and bulk download generated videos from DOM"><ion-icon name="cloud-download-outline" class="hf-icon md hydrated" aria-hidden="true" role="img"></ion-icon><span class="btn-label">Pre-Fetch</span></button>
                    <button id="hf-btn-start" class="hf-btn hf-btn-primary" data-tooltip="Start processing the queue"><span class="btn-label">Start Queue</span></button>
                    <button id="hf-btn-pause" class="hf-btn hf-btn-pause hf-btn-icon" data-tooltip="Pause/Resume queue processing"><span class="sr-only btn-label">Pause</span></button>
                    <button id="hf-btn-stop" class="hf-btn hf-btn-stop btn-stop hf-btn-icon" data-tooltip="Stop queue processing"><span class="btn-label sr-only">Stop</span></button>
                </div>
              </div>
            </div>

            <div class="hf-body">
                <div class="button-row hf-import-export-row">
                    <input type="file" id="hf-csv-input" accept=".csv" class="hf-file-input">
                    <input type="file" id="hf-video-input" multiple class="hf-file-input">
                    <button id="hf-btn-import-csv" class="hf-btn btn-primary hf-btn-flex" data-tooltip="Import CSV file with queue data"><span class="btn-label">Import CSV</span></button>
                    <button id="hf-btn-match-videos" class="hf-btn btn-secondary hf-btn-flex" data-tooltip="Match local videos with queue items"><span class="btn-label">Match Videos</span></button>
                    <button id="hf-btn-export" class="hf-btn btn-success hf-btn-flex" data-tooltip="Export queue data to CSV"><span class="btn-label">Export</span></button>
                    <button id="hf-btn-clear" class="hf-btn btn-stop  hf-btn-flex" data-tooltip="Clear all queue data"><span class="btn-label">Clear</span></button>
                </div>
                <textarea id="hf-input" placeholder="Paste spreadsheet data here (ID, img_URL, Prompt)..."></textarea>
                <div class="hf-stats">
                    <span id="hf-status-text"></span>
                    <span id="hf-counter"></span>
                </div>
                <label class="hf-row-label">
                  <input class="hf-checkbox" type="checkbox" id="hf-auto-download" style="cursor: pointer;" checked>
                  <span>Auto-download videos when ready</span>
                </label>
            </div>
          <!-- LOG CONTAINER WITH ACCORDION TOGGLE -->
            <div class="hf-logs-accordion">
              <!-- Accordion Header -->
              <div class="hf-logs-accordion-header">
                <button class="hf-logs-toggle-btn" id="hf-logs-toggle" data-tooltip="Toggle between Table Log and Workflow Log">
                  <ion-icon name="list" class="hf-icon"></ion-icon>
                  <span class="hf-logs-toggle-label">Workflow Log</span>
                  <ion-icon name="chevron-down" class="hf-icon extra-icon right"></ion-icon>
                </button>
                 <div class="hf-log-buttons">
                  <button class="hf-log-btn" id="hf-table-log-clear" data-tooltip="Clear Generation Table Log">
                    <ion-icon name="trash" class="hf-icon md hydrated" aria-hidden="true" style="font-size: 12px;" role="img"></ion-icon>
                  </button>
                </div>
              </div>

              <!-- Table Log (Generation Progress) -->
              <div class="hf-logs-container hf-log-section-hidden" id="hf-table-log-section">
                <div class="hf-log-area">
                <table id="hf-log-table">
                    <thead>
                        <tr>
                            <th class="hf-col-th hf-col-id" data-sort-key="id">ID</th>
                            <th class="hf-col-th hf-col-prompt" data-sort-key="prompt">Prompt</th>
                            <th class="hf-col-th hf-col-status" data-sort-key="status">Status</th>
                            <th class="hf-col-th hf-col-timestamp" data-sort-key="timestamp">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                  </div>
              </div>

              <!-- Workflow Log (Process Tracking) -->
              <div class="hf-panel-log-wrapper hf-log-section-active" id="hf-workflow-log-section">
                <div class="hf-log-buttons">
                  <button class="hf-log-btn" id="hf-log-copy" data-tooltip="Copy Log">
                    <ion-icon name="copy" class="hf-icon md hydrated" aria-hidden="true" style="font-size: 12px;" role="img"></ion-icon>
                  </button>
                  <button class="hf-log-btn" id="hf-log-download" data-tooltip="Download Log">
                    <ion-icon name="download" class="hf-icon md hydrated" aria-hidden="true" style="font-size: 12px;" role="img"></ion-icon>
                  </button>
                  <button class="hf-log-btn" id="hf-log-clear" data-tooltip="Clear Log">
                    <ion-icon name="trash-outline" class="hf-icon md hydrated" aria-hidden="true" style="font-size: 12px;" role="img"></ion-icon>
                  </button>
                </div>
                <div class="hf-log-area" id="hf-log-area"></div>
              </div>
            </div>
        `;

        uiRoot.appendChild(panel);
        // Styles with CSS Isolation
        GM_addStyle(`


body:has(#hf-panel), #hf-ui-root, body:has(#hf-panel) table#hf-prefetch-table, #hf-ui-root  #hf-prefetch-table-scroll{
td.cell-id-cell {
	max-width: 30px;
}
td.url-cell.download-url-cell {
	width: 40%;
		padding: 15px!important;
position: relative;
	border-right: 1px solid var(--hf-table-border) !important;
}
td.url-cell.download-url-cell a{
	max-width: -webkit-fill-available;
	box-sizing: border-box;
	width: 100%;
}
.hf-table td.select-cell, .hf-table th.select-head {
	width: 50px !important;
	max-width: 50px !important;
	text-align: center;
	padding:0!important;
	border-right: 1px solid var(--hf-table-border) !important;

}
.hf-table td.hf-image-cell {
	text-align: center !important;
	position: relative;
	min-height: 50px !important;
	height: 50px !important;
	width: 50px !important;
	overflow: hidden;
	object-fit: cover;
	object-position: center;
	background: var(--hf-header-bg);
	color: #78787812 !important;
	border-right: 1px solid var(--hf-table-border) !important;

}
	.hf-table td.status-cell {
	max-width: 95px!important;
	width: fit-content!important;
}
	div#hf-prefetch-table-scroll {
	border-radius: 8px;
	outline: 1px solid var(--hf-table-border) !important;
			background: var(--hf-panel-bg);


}
#hf-ui-root #hf-panel  #hf-table-log-section {
			max-height: 100%!important;

	max-height: -webkit-fill-available!important;
height: -webkit-fill-available!important;
	resize:none!important;
overflow: hidden!important;
}

#hf-ui-root #hf-panel #hf-table-log-section .hf-log-area:has(table) {
	padding: 0!important;
height: auto!important;
	overflow-y: auto!important;

}
#hf-ui-root #hf-panel #hf-table-log-section .hf-log-area table#hf-log-table td{
font-size: 10px!important;
border-right: 1px solid #222 !important;
	padding: var(--hf-spacing-sm) var(--hf-spacing-sm) !important;
}
#hf-ui-root #hf-panel #hf-table-log-section .hf-log-area table#hf-log-table td.prompt-cell, #hf-ui-root #hf-panel #hf-table-log-section .hf-log-area table#hf-log-table th.hf-col-prompt{
white-space: nowrap;
	max-width: 180px!important;
	min-width: 20%!important;
	overflow: hidden!important;
		text-overflow: ellipsis!important;

}
	}



.hf-checkbox-label {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
	justify-content: flex-start;
	gap: 8px;
	white-space: nowrap;
	font-size: 14px;
	padding: 5px!important;
	/* flex: 1; */
}

div#hf-prefetch-filter-bar {
	margin-top: 10px!important;
	padding: 5px!important;
	position: relative;
}
 #hf-ui-root #hf-panel .hf-panel-log-wrapper .hf-log-entry:not(:has(.hf-log-content)) {
	padding: 14px!important;
  --accent-color:#7f7f7f!important;
}
 #hf-ui-root #hf-panel .hf-panel-log-wrapper:not(:has(.hf-log-content)) .hf-log-buttons {
	display:none!important;
}
    `);

        // Initialize logging system
        WorkflowLogger.init();

        // Accordion toggle for logs
        const logsToggle = document.getElementById('hf-logs-toggle');
        const tableLogSection = document.getElementById('hf-table-log-section');
        const workflowLogSection = document.getElementById('hf-workflow-log-section');
        let activeLogSection = 'workflow'; // 'table' or 'workflow'  — defaults to workflow

        if (logsToggle && tableLogSection && workflowLogSection) {
            // Auto-switch to table view if the queue already has content
            if (STATE.queue && STATE.queue.length > 0) {
                activeLogSection = 'table';
                tableLogSection.classList.remove('hf-log-section-hidden');
                tableLogSection.classList.add('hf-log-section-active');
                workflowLogSection.classList.remove('hf-log-section-active');
                workflowLogSection.classList.add('hf-log-section-hidden');
                logsToggle.querySelector('.hf-logs-toggle-label').textContent = 'Generation Table Log';
                logsToggle.querySelector('ion-icon').setAttribute('name', 'list');
            }
            logsToggle.addEventListener('click', () => {
                activeLogSection = activeLogSection === 'table' ? 'workflow' : 'table';

                if (activeLogSection === 'table') {
                    tableLogSection.classList.remove('hf-log-section-hidden');
                    tableLogSection.classList.add('hf-log-section-active');
                    workflowLogSection.classList.remove('hf-log-section-active');
                    workflowLogSection.classList.add('hf-log-section-hidden');
                    logsToggle.querySelector('.hf-logs-toggle-label').textContent = 'Generation Table Log';
                    logsToggle.querySelector('ion-icon').setAttribute('name', 'list');
                } else {
                    workflowLogSection.classList.remove('hf-log-section-hidden');
                    workflowLogSection.classList.add('hf-log-section-active');
                    tableLogSection.classList.remove('hf-log-section-active');
                    tableLogSection.classList.add('hf-log-section-hidden');
                    logsToggle.querySelector('.hf-logs-toggle-label').textContent = 'Workflow Log';
                    logsToggle.querySelector('ion-icon').setAttribute('name', 'grid');
                }
            });
        }

        // Log button event listeners
        const logCopyBtn = document.getElementById('hf-log-copy');
        const logDownloadBtn = document.getElementById('hf-log-download');
        const logClearBtn = document.getElementById('hf-log-clear');

        if (logCopyBtn) {
            logCopyBtn.addEventListener('click', () => WorkflowLogger.copyLog());
        }
        if (logDownloadBtn) {
            logDownloadBtn.addEventListener('click', () => WorkflowLogger.downloadLog());
        }
        if (logClearBtn) {
            logClearBtn.addEventListener('click', () => {
                WorkflowLogger.clearLog();
            });
        }

        // Table log clear button
        const tableLogClearBtn = document.getElementById('hf-table-log-clear');
        if (tableLogClearBtn) {
            tableLogClearBtn.addEventListener('click', () => {
                const tbody = document.querySelector('#hf-log-table tbody');
                if (tbody) {
                    tbody.innerHTML = '';
                    logInfo('Generation table log cleared');
                }
            });
        }

        // Initialize TableSorter for log table
        const logTable = document.getElementById('hf-log-table');
        if (logTable) {
            new TableSorter(logTable);
        }

        // Event Listeners
        const startBtn = document.getElementById('hf-btn-start');
        const pauseBtn = document.getElementById('hf-btn-pause');
        const stopBtn = document.getElementById('hf-btn-stop');
        const dashboardBtn = document.getElementById('hf-btn-dashboard');
        const importCsvBtn = document.getElementById('hf-btn-import-csv');
        const csvInput = document.getElementById('hf-csv-input');
        const matchVideosBtn = document.getElementById('hf-btn-match-videos');
        const videoInput = document.getElementById('hf-video-input');
        const exportBtn = document.getElementById('hf-btn-export');
        const clearBtn = document.getElementById('hf-btn-clear');

        console.log('[buildUI] Setting up button handlers');
        console.log('[buildUI] Buttons found - start:', !!startBtn, 'pause:', !!pauseBtn, 'stop:', !!stopBtn, 'dashboard:', !!dashboardBtn);
        console.log('[buildUI] Functions available - startQueue:', typeof startQueue, 'togglePause:', typeof togglePause, 'stopQueue:', typeof stopQueue, 'clearQueue:', typeof clearQueue);

        if (startBtn && typeof startQueue === 'function') {
            startBtn.onclick = () => {
                console.log('[Button] hf-btn-start clicked');
                try {
                    startQueue();
                } catch (error) {
                    console.error('[Button] Error in startQueue:', error);
                }
            };
        } else {
            console.error('[buildUI] startBtn or startQueue not available');
        }

        if (pauseBtn && typeof togglePause === 'function') {
            pauseBtn.onclick = () => {
                console.log('[Button] hf-btn-pause clicked');
                try {
                    togglePause();
                } catch (error) {
                    console.error('[Button] Error in togglePause:', error);
                }
            };
        } else {
            console.error('[buildUI] pauseBtn or togglePause not available');
        }

        if (stopBtn && typeof stopQueue === 'function') {
            stopBtn.onclick = () => {
                console.log('[Button] hf-btn-stop clicked');
                try {
                    stopQueue();
                } catch (error) {
                    console.error('[Button] Error in stopQueue:', error);
                }
            };
        } else {
            console.error('[buildUI] stopBtn or stopQueue not available');
        }

        if (dashboardBtn && typeof showDashboard === 'function') {
            dashboardBtn.onclick = () => {
                console.log('[Button] hf-btn-dashboard clicked');
                try {
                    showDashboard();
                } catch (error) {
                    console.error('[Button] Error in showDashboard:', error);
                }
            };
        } else {
            console.error('[buildUI] dashboardBtn or showDashboard not available');
        }

        const prefetchBtn = document.getElementById('hf-btn-prefetch');
        if (prefetchBtn && typeof showPreFetchModal === 'function') {
            prefetchBtn.onclick = () => {
                console.log('[Button] hf-btn-prefetch clicked');
                try {
                    showPreFetchModal();
                } catch (error) {
                    console.error('[Button] Error in showPreFetchModal:', error);
                }
            };
        } else {
            console.error('[buildUI] prefetchBtn or showPreFetchModal not available');
        }

        if (importCsvBtn && csvInput) {
            importCsvBtn.onclick = () => {
                console.log('[Button] hf-btn-import-csv clicked');
                try {
                    csvInput.click();
                } catch (error) {
                    console.error('[Button] Error clicking csv input:', error);
                }
            };
        } else {
            console.error('[buildUI] importCsvBtn or csvInput not available');
        }

        if (csvInput) {
            csvInput.addEventListener('change', (e) => {
                console.log('[Input] hf-csv-input changed, file:', e.target.files?.[0]?.name);
                try {
                    handleCSVImport(e);
                } catch (error) {
                    console.error('[Input] Error in handleCSVImport:', error);
                }
            });
        }

        if (matchVideosBtn && videoInput) {
            matchVideosBtn.onclick = () => {
                console.log('[Button] hf-btn-match-videos clicked');
                try {
                    videoInput.click();
                } catch (error) {
                    console.error('[Button] Error clicking video input:', error);
                }
            };
        } else {
            console.error('[buildUI] matchVideosBtn or videoInput not available');
        }

        if (videoInput) {
            videoInput.addEventListener('change', (e) => {
                console.log('[Input] hf-video-input changed, files:', e.target.files?.length);
                try {
                    handleLocalVideoUpload(e);
                } catch (error) {
                    console.error('[Input] Error in handleLocalVideoUpload:', error);
                }
            });
        }

        if (exportBtn && typeof exportData === 'function') {
            exportBtn.onclick = () => {
                console.log('[Button] hf-btn-export clicked');
                try {
                    exportData();
                } catch (error) {
                    console.error('[Button] Error in exportData:', error);
                }
            };
        } else {
            console.error('[buildUI] exportBtn or exportData not available');
        }

        if (clearBtn && typeof clearQueue === 'function') {
            clearBtn.onclick = () => {
                console.log('[Button] hf-btn-clear clicked');
                try {
                    clearQueue();
                } catch (error) {
                    console.error('[Button] Error in clearQueue:', error);
                }
            };
        } else {
            console.error('[buildUI] clearBtn or clearQueue not available');
        }

        // Toast Test Buttons (only if ENABLE_TOAST_TESTS is true)
        if (ENABLE_TOAST_TESTS) {
            const toastTestContainer = document.createElement('div');
            toastTestContainer.id = 'hf-toast-test-container';
            toastTestContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 8px; background: rgba(0,0,0,0.8); padding: 12px; border-radius: 8px;';

            const testTitle = document.createElement('div');
            testTitle.textContent = 'Toast Tests';
            testTitle.style.cssText = 'color: white; font-weight: bold; margin-bottom: 4px; font-size: 12px;';
            toastTestContainer.appendChild(testTitle);

            // Test Info Toast
            const testInfoBtn = document.createElement('button');
            testInfoBtn.textContent = 'Test Info Toast';
            testInfoBtn.className = 'hf-btn btn-primary';
            testInfoBtn.style.cssText = 'font-size: 11px; padding: 6px 12px;';
            testInfoBtn.onclick = () => {
                toastManager.info('This is an info toast notification', {
                    title: 'Info Test',
                    icon: 'information-circle'
                });
            };
            toastTestContainer.appendChild(testInfoBtn);

            // Test Success Toast
            const testSuccessBtn = document.createElement('button');
            testSuccessBtn.textContent = 'Test Success Toast';
            testSuccessBtn.className = 'hf-btn btn-success';
            testSuccessBtn.style.cssText = 'font-size: 11px; padding: 6px 12px;';
            testSuccessBtn.onclick = () => {
                toastManager.success('This is a success toast notification', {
                    title: 'Success Test',
                    icon: 'checkmark-circle'
                });
            };
            toastTestContainer.appendChild(testSuccessBtn);

            // Test Warning Toast
            const testWarningBtn = document.createElement('button');
            testWarningBtn.textContent = 'Test Warning Toast';
            testWarningBtn.className = 'hf-btn btn-warning';
            testWarningBtn.style.cssText = 'font-size: 11px; padding: 6px 12px;';
            testWarningBtn.onclick = () => {
                toastManager.warning('This is a warning toast notification', {
                    title: 'Warning Test',
                    icon: 'warning'
                });
            };
            toastTestContainer.appendChild(testWarningBtn);

            // Test Error Toast
            const testErrorBtn = document.createElement('button');
            testErrorBtn.textContent = 'Test Error Toast';
            testErrorBtn.className = 'hf-btn btn-stop';
            testErrorBtn.style.cssText = 'font-size: 11px; padding: 6px 12px;';
            testErrorBtn.onclick = () => {
                toastManager.error('This is an error toast notification', {
                    title: 'Error Test',
                    icon: 'close-circle'
                });
            };
            toastTestContainer.appendChild(testErrorBtn);

            // Test Confirm Dialog
            const testConfirmBtn = document.createElement('button');
            testConfirmBtn.textContent = 'Test Confirm Dialog';
            testConfirmBtn.className = 'hf-btn btn-secondary';
            testConfirmBtn.style.cssText = 'font-size: 11px; padding: 6px 12px; margin-top: 4px;';
            testConfirmBtn.onclick = async () => {
                const result = await toastManager.confirm('Are you sure you want to proceed with this action?', {
                    title: 'Confirmation Test',
                    type: 'warning',
                    confirmText: 'Yes, Proceed',
                    cancelText: 'Cancel',
                    confirmIcon: 'checkmark',
                    cancelIcon: 'close'
                });
                if (result) {
                    toastManager.success('You confirmed the action!');
                } else {
                    toastManager.info('You cancelled the action.');
                }
            };
            toastTestContainer.appendChild(testConfirmBtn);

            // Test Confirm with Danger
            const testDangerConfirmBtn = document.createElement('button');
            testDangerConfirmBtn.textContent = 'Test Danger Confirm';
            testDangerConfirmBtn.className = 'hf-btn btn-stop';
            testDangerConfirmBtn.style.cssText = 'font-size: 11px; padding: 6px 12px;';
            testDangerConfirmBtn.onclick = async () => {
                const result = await toastManager.confirm('This action cannot be undone. Are you absolutely sure?', {
                    title: 'Dangerous Action',
                    type: 'danger',
                    confirmText: 'Delete',
                    cancelText: 'Cancel',
                    confirmIcon: 'trash',
                    confirmClass: 'hf-btn btn-stop'
                });
                if (result) {
                    toastManager.error('Action confirmed - this would have been destructive!');
                } else {
                    toastManager.success('Action cancelled - safe!');
                }
            };
            toastTestContainer.appendChild(testDangerConfirmBtn);

            document.body.appendChild(toastTestContainer);
            console.log('[Toast Tests] Test buttons enabled. Set ENABLE_TOAST_TESTS = false to disable.');
        }

        // Textarea input listener - update button states when content changes
        const textareaInput = document.getElementById('hf-input');
        if (textareaInput) {
            textareaInput.addEventListener('input', () => {
                updateButtonStates();
            });
            textareaInput.addEventListener('paste', () => {
                // Use setTimeout to ensure paste content is processed
                setTimeout(() => {
                    updateButtonStates();
                }, 0);
            });
        }

        // Dashboard textarea input listener - update modal button states
        const dashboardTextarea = document.getElementById('hf-dashboard-input');
        if (dashboardTextarea) {
            dashboardTextarea.addEventListener('input', () => {
                if (typeof updateModalButtonStates === 'function') {
                    updateModalButtonStates();
                }
            });
            dashboardTextarea.addEventListener('paste', () => {
                setTimeout(() => {
                    if (typeof updateModalButtonStates === 'function') {
                        updateModalButtonStates();
                    }
                }, 0);
            });
        }

        // Auto-download checkbox - use once flag to prevent duplicate listeners
        const autoDownloadCheckbox = document.getElementById('hf-auto-download');
        if (autoDownloadCheckbox) {
            // Remove any existing listeners by cloning
            if (autoDownloadCheckbox.dataset.listenerAttached === 'true') {
                // Already has listener, don't add another
                return;
            }

            autoDownloadCheckbox.checked = HFStorage.getAutoDownload();
            autoDownloadCheckbox.dataset.listenerAttached = 'true';

            // Use capture phase and stop propagation to prevent multiple fires
            autoDownloadCheckbox.addEventListener('change', function (e) {
                e.stopPropagation();
                e.stopImmediatePropagation();

                // Only log if the value actually changed from stored value
                const newValue = e.target.checked;
                const storedValue = HFStorage.getAutoDownload();

                if (newValue !== storedValue) {
                    HFStorage.setAutoDownload(newValue);
                    logInfo(`Auto-download ${newValue ? 'enabled' : 'disabled'}`);
                    toastManager.info(`Auto-download ${newValue ? 'enabled' : 'disabled'}`);
                }
            }, { capture: true, once: false });
        }

        // Initial log entry - prevent duplicates
        const lastLog = WorkflowLogger.logs[WorkflowLogger.logs.length - 1];
        if (!lastLog || !lastLog.message || !lastLog.message.includes('Loaded')) {
            logInfo(`${SCRIPT_NAME} v${SCRIPT_VERSION} Loaded`);
        }

        // Panel draggable and minimize functionality
        setupPanelDragAndMinimize(panel);

        // Initialize button icons
        initializeButtonIcons();

        tooltipManager.enable();

        // Initialize button states
        updateButtonStates();

        // Update button states when queue changes - ensure it's called
        const originalLogRow = logRow;
        window.logRow = function (item) {
            originalLogRow(item);
            // updateButtonStates is already called in logRow
        };

        // Restore queue from storage and update UI
        if (STATE.queue.length > 0) {
            STATE.queue.forEach(logRow);
            updateStatus('Ready');
            updateButtonStates(); // Ensure buttons are in correct state
        }
    }

    /**************************************************************
     *   DASHBOARD MODAL & CSV IMPORT/EXPORT
     **************************************************************/

    function showDashboard() {
        // Re-sync in-memory queue from persistent storage (survives modal close / page SPA updates)
        STATE.queue = HFStorage.getQueue();

        // Re-sync mappings
        const storedMappings = HFStorage.getMapping();
        STATE.generationMap.clear();
        Object.entries(storedMappings).forEach(([cellId, data]) => {
            const item = STATE.queue.find(q => q.id === data.queueId);
            if (item) {
                STATE.generationMap.set(cellId, item);
                item.cellId = cellId;
            }
        });

        const modal = new HFModalBuilder(`Higgsfield Dashboard`, {
            maxWidth: '95vw',
            customClasses: ['hf-dashboard-modal', 'hf-track-modal-content']
        });

        // Build content wrapper
        const wrapper = createElement('div', { class: 'hf-track-modal-content' });

        // ============================================
        // FILTER BAR (Tabs + Search + Actions)
        // ============================================
        const filterBar = createElement('div', { class: 'hf-track-filter-bar' });

        // Filter tabs container - using stats-based tabs
        const tabsContainer = createElement('div', { class: 'hf-track-tabs' });

        // Initialize filter state
        window.dashboardActiveFilters = new Set(['total']);

        // Calculate filter counts using same logic as stats
        const getFilterCounts = () => {
            return {
                total: STATE.queue.length,
                pending: STATE.queue.filter(i => i.status === 'Pending').length,
                generating: STATE.queue.filter(i => i.status === 'Generating' || i.status.includes('Gen')).length,
                success: STATE.queue.filter(i => i.status === 'Success' || i.status === 'Downloaded' || i.status === 'Has Video').length,
                failed: STATE.queue.filter(i => i.status === 'Error' || i.status === 'Failed' || i.status === 'Download Error').length
            };
        };

        const updateFilterTabCounts = () => {
            const counts = getFilterCounts();

            // Update tab counts
            tabs.forEach(tab => {
                const countEl = document.getElementById(`hf-tab-count-${tab.id}`);
                if (countEl) {
                    countEl.textContent = counts[tab.id] || 0;
                }

                // Disable tabs with zero count (except 'total')
                const tabBtn = tabsContainer.querySelector(`[data-filter="${tab.id}"]`);
                if (tabBtn && tab.id !== 'total') {
                    const count = counts[tab.id] || 0;
                    tabBtn.disabled = count === 0;
                }
            });
        };

        // Stats-based tabs matching the stats row
        const tabs = [
            { id: 'total', label: 'Total', icon: 'list', tooltip: 'View all items' },
            { id: 'pending', label: 'Pending', icon: 'time', tooltip: 'View pending items' },
            { id: 'generating', label: 'Generating', icon: 'play', tooltip: 'View items being generated' },
            { id: 'success', label: 'Success', icon: 'checkmark-circle', tooltip: 'View successfully completed items' },
            { id: 'failed', label: 'Failed', icon: 'close-circle', tooltip: 'View failed items' }
        ];

        tabs.forEach(tab => {
            const btn = createElement('button', {
                class: `hf-tab-btn ${tab.id === 'total' ? 'active' : ''}`,
                'data-filter': tab.id,
                'data-tooltip': tab.tooltip
            });
            btn.appendChild(createIcon(tab.icon));
            btn.appendChild(createElement('span', { text: tab.label }));
            const countSpan = createElement('span', {
                class: 'hf-stat-value',
                id: `hf-tab-count-${tab.id}`,
                text: '0'
            });
            btn.appendChild(countSpan);

            btn.addEventListener('click', () => {
                if (btn.disabled) return;

                // Single selection - only one filter active at a time
                if (tab.id === 'total') {
                    window.dashboardActiveFilters.clear();
                    window.dashboardActiveFilters.add('total');
                    tabsContainer.querySelectorAll('.hf-tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                } else {
                    window.dashboardActiveFilters.clear();
                    window.dashboardActiveFilters.add(tab.id);
                    tabsContainer.querySelectorAll('.hf-tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }

                if (window.updateDashboardTable) {
                    window.updateDashboardTable();
                }
            });

            tabsContainer.appendChild(btn);
        });

        filterBar.appendChild(tabsContainer);

        // Search input
        const searchContainer = createElement('div', { class: 'hf-track-search' });
        const searchInput = createElement('input', {
            type: 'text',
            placeholder: 'Search queue...',
            id: 'hf-dashboard-search-input',
            class: 'hf-input',
            'data-tooltip': 'Search by ID, prompt, or status'
        });
        // Make searchFilter accessible to updateDashboardTable
        window.dashboardSearchFilter = '';
        searchInput.addEventListener('input', (e) => {
            window.dashboardSearchFilter = e.target.value.toLowerCase();
            if (window.updateDashboardTable) {
                window.updateDashboardTable();
            }
        });
        searchContainer.appendChild(createIcon('search'));
        searchContainer.appendChild(searchInput);
        filterBar.appendChild(searchContainer);

        // Toggle optional columns button
        let optionalColumnsVisible = false;
        const toggleOptionalBtn = createElement('button', {
            id: 'hf-toggle-optional',
            class: 'hf-btn hf-btn-icon',
            'data-tooltip': 'Show/Hide optional columns'
        });
        toggleOptionalBtn.appendChild(createIcon('eye-off', '16px'));
        toggleOptionalBtn.addEventListener('click', () => {
            optionalColumnsVisible = !optionalColumnsVisible;
            const optionalCols = table.querySelectorAll('.optional-column');
            optionalCols.forEach(col => {
                col.style.display = optionalColumnsVisible ? '' : 'none';
            });
            // Update icon
            const icon = toggleOptionalBtn.querySelector('ion-icon');
            if (icon) {
                icon.setAttribute('name', optionalColumnsVisible ? 'eye' : 'eye-off');
            }
        });
        filterBar.appendChild(toggleOptionalBtn);

        // Bulk actions dropdown (initially hidden)
        const bulkActionsContainer = createElement('div', {
            id: 'hf-bulk-actions-container',
            class: 'hf-bulk-actions-container floating-version',
            style: 'display: none;'
        });

        const selectionCounter = createElement('span', {
            id: 'hf-selection-counter',
            class: 'hf-selection-counter',
            text: '0 selected'
        });

        const bulkActionsBtn = createElement('button', {
            id: 'hf-bulk-actions-btn',
            class: 'hf-btn btn-primary',
            'data-tooltip': 'Bulk actions for selected items'
        });
        bulkActionsBtn.appendChild(createIcon('ellipsis-horizontal'));
        bulkActionsBtn.appendChild(createElement('span', { text: 'Actions' }));

        const bulkActionsDropdown = createElement('div', {
            id: 'hf-bulk-actions-dropdown',
            class: 'hf-bulk-actions-dropdown',
            style: 'display: none;'
        });

        bulkActionsContainer.appendChild(selectionCounter);
        bulkActionsContainer.appendChild(bulkActionsBtn);
        bulkActionsContainer.appendChild(bulkActionsDropdown);
        //filterBar.appendChild(bulkActionsContainer);

        wrapper.appendChild(filterBar);

        // Update filter tab counts
        updateFilterTabCounts();

        // Helper functions for bulk actions
        function updateSelectAllCheckbox() {
            const selectAllCheckbox = document.getElementById('hf-select-all-checkbox');
            if (!selectAllCheckbox) return;
            const tbody = table.querySelector('tbody');
            const rowCheckboxes = Array.from(tbody.querySelectorAll('input[type="checkbox"].hf-row-checkbox'));
            const checkedCount = rowCheckboxes.filter(cb => cb.checked).length;
            selectAllCheckbox.checked = checkedCount > 0 && checkedCount === rowCheckboxes.length;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < rowCheckboxes.length;
        }

        function updateBulkActionsVisibility() {
            const selectedCount = window.dashboardSelectedItems.size;
            if (selectedCount > 0) {
                bulkActionsContainer.style.display = 'flex';
            } else {
                bulkActionsContainer.style.display = 'none';
            }
        }

        function updateSelectionCounter() {
            const selectedCount = window.dashboardSelectedItems.size;
            selectionCounter.textContent = `${selectedCount} selected`;
        }

        function bulkDownloadSelected() {
            const selectedIds = Array.from(window.dashboardSelectedItems);
            const selectedItems = STATE.queue.filter(item => selectedIds.includes(item.id));
            const itemsWithVideo = selectedItems.filter(item => item.videoUrl);
            if (itemsWithVideo.length === 0) {
                toastManager.warning('No selected items have video URLs');
                return;
            }

            // Temporarily enable auto-download for bulk downloads
            const originalAutoDownload = HFStorage.getAutoDownload();
            HFStorage.setAutoDownload(true);

            let successCount = 0;
            let errorCount = 0;
            const totalCount = itemsWithVideo.length;

            toastManager.info(`Starting bulk download of ${totalCount} video(s)...`);

            itemsWithVideo.forEach((item, index) => {
                // Add small delay between downloads to avoid overwhelming the browser
                setTimeout(() => {
                    if (item.videoUrl) {
                        try {
                            // Call downloadVideo which will handle the download
                            downloadVideo(item.videoUrl, item, item.cellId);
                            successCount++;
                        } catch (error) {
                            console.error(`[bulkDownload] Error downloading item ${item.id}:`, error);
                            errorCount++;
                            item.status = 'Download Error';
                            item.errorMessage = error.message;
                            logRow(item);
                        }
                    }

                    // After all downloads are initiated, show summary
                    if (index === itemsWithVideo.length - 1) {
                        setTimeout(() => {
                            // Restore original setting
                            HFStorage.setAutoDownload(originalAutoDownload);

                            if (successCount > 0) {
                                toastManager.success(`Initiated download for ${successCount} video(s)${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
                            } else if (errorCount > 0) {
                                toastManager.error(`Failed to initiate downloads for ${errorCount} video(s)`);
                            }

                            if (window.updateDashboardTable) {
                                window.updateDashboardTable();
                            }
                        }, 500);
                    }
                }, index * 100); // 100ms delay between each download initiation
            });
        }

        function bulkCheckDuplicates() {
            console.log('[bulkCheckDuplicates] Function called');
            const selectedIds = Array.from(window.dashboardSelectedItems);
            console.log('[bulkCheckDuplicates] Selected IDs:', selectedIds);

            if (selectedIds.length === 0) {
                toastManager.warning('No items selected');
                return;
            }

            const selectedItems = STATE.queue.filter(item => selectedIds.includes(item.id));
            console.log('[bulkCheckDuplicates] Selected items:', selectedItems.length);

            // Check for duplicates by ID, prompt, or video URL
            const duplicates = [];
            const seenIds = new Set();
            const seenPrompts = new Map();
            const seenVideoUrls = new Map();

            selectedItems.forEach(item => {
                const dupes = [];

                // Check ID duplicates
                if (seenIds.has(item.id)) {
                    dupes.push('ID');
                }
                seenIds.add(item.id);

                // Check prompt duplicates (normalized)
                const normalizedPrompt = item.prompt?.toLowerCase().trim();
                if (normalizedPrompt && seenPrompts.has(normalizedPrompt)) {
                    dupes.push('Prompt');
                    const originalItem = seenPrompts.get(normalizedPrompt);
                    if (!duplicates.find(d => d.item.id === originalItem.id)) {
                        duplicates.push({ item: originalItem, reason: 'Prompt' });
                    }
                }
                if (normalizedPrompt) {
                    seenPrompts.set(normalizedPrompt, item);
                }

                // Check video URL duplicates
                if (item.videoUrl && seenVideoUrls.has(item.videoUrl)) {
                    dupes.push('Video URL');
                    const originalItem = seenVideoUrls.get(item.videoUrl);
                    if (!duplicates.find(d => d.item.id === originalItem.id)) {
                        duplicates.push({ item: originalItem, reason: 'Video URL' });
                    }
                }
                if (item.videoUrl) {
                    seenVideoUrls.set(item.videoUrl, item);
                }

                if (dupes.length > 0) {
                    duplicates.push({ item, reason: dupes.join(', ') });
                }
            });

            console.log('[bulkCheckDuplicates] Found duplicates:', duplicates.length);

            if (duplicates.length > 0) {
                const message = `Found ${duplicates.length} duplicate(s):\n${duplicates.map(d => `- ${d.item.id}: ${d.reason}`).join('\n')}`;
                toastManager.warning(message, { duration: 8000 });
                console.log('[bulkCheckDuplicates] Duplicates:', duplicates);
            } else {
                toastManager.success('No duplicates found in selected items');
            }
        }

        function bulkDeleteSelected() {
            const selectedIds = Array.from(window.dashboardSelectedItems);
            toastManager.confirm(`Are you sure you want to delete ${selectedIds.length} items?`, {
                title: 'Delete Items',
                type: 'danger'
            }).then(confirmed => {
                if (confirmed) {
                    STATE.queue = STATE.queue.filter(item => !selectedIds.includes(item.id));
                    HFStorage.saveQueue(STATE.queue);
                    window.dashboardSelectedItems.clear();
                    updateDashboardTable();
                    updateBulkActionsVisibility();
                    updateSelectionCounter();
                    toastManager.success(`Deleted ${selectedIds.length} items`);
                }
            });
        }

        function bulkResetRegenerate() {
            const selectedIds = Array.from(window.dashboardSelectedItems);
            const selectedItems = STATE.queue.filter(item => selectedIds.includes(item.id));
            const itemsWithImage = selectedItems.filter(item => item.imgUrl);
            if (itemsWithImage.length === 0) {
                toastManager.warning('Selected items must have image URLs to regenerate');
                return;
            }
            toastManager.confirm(`Reset and regenerate ${itemsWithImage.length} items?`, {
                title: 'Reset and Regenerate',
                type: 'warning'
            }).then(confirmed => {
                if (confirmed) {
                    itemsWithImage.forEach(item => {
                        item.status = 'Pending';
                        item.cellId = null;
                        item.videoUrl = null;
                        item.filename = null;
                    });
                    HFStorage.saveQueue(STATE.queue);
                    updateDashboardTable();
                    toastManager.success(`Reset ${itemsWithImage.length} items for regeneration`);
                }
            });
        }

        function bulkFetchMetadata() {
            const selectedIds = Array.from(window.dashboardSelectedItems);
            if (selectedIds.length === 0) {
                toastManager.warning('No items selected');
                return;
            }

            const selectedItems = STATE.queue.filter(item => selectedIds.includes(item.id));
            let updatedCount = 0;

            toastManager.info(`Fetching metadata for ${selectedItems.length} items...`);

            selectedItems.forEach(item => {
                let updated = false;

                // If item has videoUrl but missing other metadata, try to extract from URL
                if (item.videoUrl && !item.cellId) {
                    const videoId = extractVideoIdFromUrl(item.videoUrl);
                    if (videoId) {
                        // Try to get mapping data
                        const mapping = HFStorage.getVideoMappingByOriginalId(item.id);
                        if (mapping && mapping.cellId) {
                            item.cellId = mapping.cellId;
                            updated = true;
                        }
                    }
                }

                // If item has cellId but missing videoUrl, try to get from mapping
                if (item.cellId && !item.videoUrl) {
                    const mapping = HFStorage.getMapping();
                    const cellData = mapping[item.cellId];
                    if (cellData && cellData.videoUrl) {
                        item.videoUrl = cellData.videoUrl;
                        updated = true;
                    }
                }

                // If item missing timestamp, add current timestamp
                if (!item.timestamp) {
                    item.timestamp = Date.now();
                    updated = true;
                }

                if (updated) {
                    updatedCount++;
                }
            });

            if (updatedCount > 0) {
                HFStorage.saveQueue(STATE.queue);
                if (window.updateDashboardTable) {
                    window.updateDashboardTable();
                }
                toastManager.success(`Updated metadata for ${updatedCount} item(s)`);
            } else {
                toastManager.info('No metadata updates needed for selected items');
            }
        }

        // Create bulk action items
        const bulkActions = [
            { id: 'download', text: 'Download Selected Videos', icon: 'cloud-download', handler: bulkDownloadSelected },
            { id: 'check-duplicates', text: 'Check if Duplicated', icon: 'git-compare', handler: bulkCheckDuplicates },
            { id: 'delete', text: 'Delete Entry', icon: 'trash', handler: bulkDeleteSelected },
            { id: 'reset-regenerate', text: 'Reset and Regenerate', icon: 'refresh', handler: bulkResetRegenerate },
            { id: 'fetch-metadata', text: 'Fetch All Items Metadata', icon: 'cloud-download-outline', handler: bulkFetchMetadata }
        ];

        bulkActions.forEach(action => {
            const actionBtn = createElement('button', {
                class: 'hf-bulk-action-item',
                'data-action': action.id
            });
            actionBtn.appendChild(createIcon(action.icon, '14px'));
            actionBtn.appendChild(createElement('span', { text: action.text }));
            actionBtn.addEventListener('click', () => {
                action.handler();
                bulkActionsDropdown.style.display = 'none';
            });
            bulkActionsDropdown.appendChild(actionBtn);
        });

        bulkActionsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = bulkActionsDropdown.style.display !== 'none';
            bulkActionsDropdown.style.display = isVisible ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (!bulkActionsContainer.contains(e.target)) {
                bulkActionsDropdown.style.display = 'none';
            }
        });

        // Store functions globally
        window.updateSelectAllCheckbox = updateSelectAllCheckbox;
        window.updateBulkActionsVisibility = updateBulkActionsVisibility;
        window.updateSelectionCounter = updateSelectionCounter;

        // ============================================
        // STATS BAR
        // ============================================
        const statsBar = createElement('div', { class: 'hf-queue-stats', id: 'hf-dashboard-stats' });
        const statItems = [
            { key: 'total', label: 'Total', icon: 'list' },
            { key: 'pending', label: 'Pending', icon: 'time' },
            { key: 'generating', label: 'Generating', icon: 'play' },
            { key: 'success', label: 'Success', icon: 'checkmark-circle' },
            { key: 'failed', label: 'Failed', icon: 'close-circle' },
            { key: 'paused', label: 'Paused', icon: 'pause' },
            { key: 'stopped', label: 'Stopped', icon: 'stop' }
        ];
        statItems.forEach(item => {
            const stat = createElement('div', { class: 'hf-stat-item', 'data-stat': item.key });
            stat.appendChild(createIcon(item.icon, '12px'));
            stat.appendChild(createElement('span', { class: 'hf-stat-label', text: item.label + ':' }));
            stat.appendChild(createElement('span', { class: 'hf-stat-value', id: `hf-stat-${item.key}`, text: '0' }));
            statsBar.appendChild(stat);
        });

        // Show/hide stats bar and tabs based on queue state
        function updateStatsAndTabsVisibility() {
            const hasItems = STATE.queue.length > 0;
            if (hasItems) {
                // Show tabs, hide stats
                if (tabsContainer) tabsContainer.style.display = '';
                if (statsBar) statsBar.style.display = 'none';
            } else {
                // Show stats, hide tabs
                if (tabsContainer) tabsContainer.style.display = 'none';
                if (statsBar) statsBar.style.display = '';
            }
        }

        // Initial visibility
        updateStatsAndTabsVisibility();

        wrapper.appendChild(statsBar);
        //statsBar.prepend(bulkActionsContainer);


        // ============================================
        // INPUT SECTION (CSV Import)
        // ============================================
        const inputSection = createElement('div', { class: 'hf-dashboard-input-section' });
        inputSection.style.width = '100%';
        const inputRow = createElement('div', { class: 'hf-dashboard-input-row' });

        const textarea = createElement('textarea', {
            id: 'hf-dashboard-input',
            class: 'hf-dashboard-textarea',
            placeholder: 'Paste spreadsheet data here (ID, img_URL, Prompt)... or import CSV file'
        });
        textarea.value = document.getElementById('hf-input')?.value || '';
        textarea.style.display = 'none'; // Hidden in empty state


        const fileInput = createElement('input', {
            type: 'file',
            accept: '.csv',
            id: 'hf-dashboard-csv-input',
            class: 'hf-file-input'
        });

        const importBtn = createSmartButton({
            id: 'hf-dashboard-import',
            text: 'Import CSV',
            icon: 'cloud-upload',
            classes: ['hf-btn', 'btn-info'],
            handlers: {
                onClick: () => fileInput.click()
            }
        });

        const exportBtn = createSmartButton({
            id: 'hf-dashboard-export',
            text: 'Export CSV',
            icon: 'download',
            classes: ['hf-btn', 'btn-success'],
            handlers: {
                onClick: exportData
            }
        });

        const showTextareaBtn = createSmartButton({
            id: 'hf-dashboard-show-textarea',
            text: 'Show Textarea',
            icon: 'text-outline',
            classes: ['hf-btn', 'btn-secondary'],
            handlers: {
                onClick: () => {
                    if (textarea.style.display === 'none' || textarea.style.display === '') {
                        textarea.style.display = 'block';
                        showTextareaBtn.setText('Hide Textarea');
                        // If textarea has content, trigger preview
                        if (textarea.value.trim()) {
                            triggerPreview(textarea.value.trim());
                        }
                    } else {
                        textarea.style.display = 'none';
                        showTextareaBtn.setText('Show Textarea');
                    }
                }
            }
        });

        // Export buttons will be in action bar, not here
        // Only Import CSV button in inputRow for empty state
        inputRow.appendChild(importBtn.getElement());
        inputRow.appendChild(showTextareaBtn.getElement());


        // Helper function to properly submit textarea content with event dispatching
        async function submitTextareaContent(textareaEl, csvData) {
            if (!textareaEl || !csvData) return;

            logInfo('Submitting textarea content with proper event dispatching...');

            // Focus the textarea first
            textareaEl.focus();

            // Use React value setter to properly set the value
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            if (nativeInputValueSetter) {
                nativeInputValueSetter.call(textareaEl, csvData);
            } else {
                textareaEl.value = csvData;
            }

            // Dispatch all required events to trigger UI rendering
            // 1. Input event (triggers React onChange handlers)
            textareaEl.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            await sleep(100);

            // 2. Change event (triggers React onChange handlers)
            textareaEl.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            await sleep(100);

            // 3. Blur event (triggers React onBlur handlers)
            textareaEl.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
            await sleep(200);

            // Wait for any preview rendering to complete
            // Check if table has been updated or if there are any pending renders
            let renderAttempts = 0;
            while (renderAttempts < 10) {
                await sleep(100);
                // Check if dashboard table exists and has been updated
                const table = document.getElementById('hf-dashboard-table');
                if (table && table.querySelector('tbody')) {
                    const rowCount = table.querySelector('tbody').children.length;
                    if (rowCount > 0 || STATE.queue.length > 0) {
                        logInfo(`Textarea submission complete. Preview rendered: ${rowCount} rows visible`);
                        break;
                    }
                }
                renderAttempts++;
            }

            logInfo('Textarea content submitted and events dispatched');
        }

        fileInput.addEventListener('change', async (e) => {
            console.log('[Input] hf-dashboard-csv-input changed');
            const file = e.target.files[0];
            if (file) {
                console.log('[Input] Reading file:', file.name);
                const reader = new FileReader();
                reader.onload = async (event) => {
                    console.log('[Input] File read, parsing CSV');
                    const csvData = event.target.result;

                    // Properly submit textarea content with event dispatching
                    await submitTextareaContent(textarea, csvData);

                    renderCancelled = false;
                    parseAndImportCSV(csvData);
                    if (window.updateDashboardTable) {
                        window.updateDashboardTable();
                    }
                };
                reader.onerror = (error) => {
                    console.error('[Input] Error reading file:', error);
                    toastManager.error('Failed to read file');
                };
                reader.readAsText(file);
            }
        });

        // Add preview trigger for textarea input - parse and show in table without starting generation
        let previewTimeout = null;
        const triggerPreview = async (csvData) => {
            if (!csvData || !csvData.trim()) {
                // If textarea is empty, clear the preview but keep existing queue
                if (window.updateDashboardTable) {
                    window.updateDashboardTable();
                }
                // Only show empty state if queue is actually empty
                if (emptyMsg && STATE.queue.length === 0) {
                    emptyMsg.style.display = '';
                }
                return;
            }

            logInfo('Textarea content detected, triggering preview...');

            // Show textarea if hidden
            if (textarea.style.display === 'none' || textarea.style.display === '') {
                textarea.style.display = 'block';
                // Update button text
                const btn = document.getElementById('hf-dashboard-show-textarea');
                if (btn) {
                    const btnText = btn.querySelector('.btn-label') || btn;
                    if (btnText.textContent) {
                        btnText.textContent = 'Hide Textarea';
                    }
                }
            }

            // Parse and import CSV data (preview only, no generation)
            try {
                renderCancelled = false;
                const previousQueueLength = STATE.queue.length;
                parseAndImportCSV(csvData);

                // Update table to show preview
                if (window.updateDashboardTable) {
                    window.updateDashboardTable();
                }

                // Hide empty state if we have items
                if (emptyMsg && STATE.queue.length > 0) {
                    emptyMsg.style.display = 'none';
                }

                const newItemsCount = STATE.queue.length - previousQueueLength;
                logInfo(`Preview updated: ${STATE.queue.length} items in queue (${newItemsCount > 0 ? `+${newItemsCount} new` : 'updated'})`);
                if (newItemsCount > 0) {
                    toastManager.success(`Preview: ${newItemsCount} new item(s) added to queue (${STATE.queue.length} total)`);
                } else {
                    toastManager.info(`Preview: ${STATE.queue.length} items in queue`);
                }
            } catch (error) {
                logError(`Error parsing textarea content for preview: ${error.message}`, { error });
                toastManager.error('Error parsing data. Please check the format.');
            }
        };

        // Debounced input handler for textarea
        textarea.addEventListener('input', (e) => {
            const csvData = e.target.value.trim();

            // Clear existing timeout
            if (previewTimeout) {
                clearTimeout(previewTimeout);
            }

            // Debounce preview trigger (wait 500ms after user stops typing)
            previewTimeout = setTimeout(() => {
                triggerPreview(csvData);
            }, 500);
        });

        // Immediate preview on paste
        textarea.addEventListener('paste', (e) => {
            // Clear existing timeout
            if (previewTimeout) {
                clearTimeout(previewTimeout);
            }

            // Wait for paste to complete, then trigger preview
            setTimeout(() => {
                const csvData = e.target.value.trim();
                triggerPreview(csvData);
            }, 100);
        });

        inputSection.appendChild(inputRow);
        inputSection.appendChild(fileInput);
        inputSection.appendChild(textarea);

        //wrapper.appendChild(inputSection);

        // ============================================
        // TABLE SECTION
        // ============================================
        const tableSection = createElement('div', { class: 'hf-dashboard-table-section' });
        const tableScroll = createElement('div', {
            id: 'hf-dashboard-table-scroll',
            class: 'hf-table-scroll'
        });

        const table = createElement('table', {
            id: 'hf-dashboard-table',
            class: 'hf-table'
        });
        const thead = createElement('thead');
        const headerRow = createElement('tr');

        const headers = [
            { key: 'select', text: '', sortable: false, checkbox: true },
            { key: 'id', text: 'ID', sortable: true },
            { key: 'image', text: 'Image', sortable: false },
            { key: 'prompt', text: 'Prompt', sortable: true },
            { key: 'status', text: 'Status', sortable: true },
            { key: 'timestamp', text: 'Timestamp', sortable: true, optional: true },
            { key: 'cellId', text: 'Cell ID', sortable: true, optional: true },
            { key: 'filename', text: 'Filename', sortable: true, optional: true },
            { key: 'actions', text: 'Actions', sortable: false }
        ];

        // Track selected items
        window.dashboardSelectedItems = window.dashboardSelectedItems || new Set();

        headers.forEach(h => {
            const th = createElement('th', {
                class: h.optional ? 'optional-column' : '',
                'data-sort-key': h.sortable ? h.key : null
            });

            if (h.checkbox) {
                // Create select-all checkbox
                const checkbox = createElement('input', {
                    type: 'checkbox',
                    id: 'hf-select-all-checkbox',
                    class: 'hf-bulk-select-checkbox'
                });
                checkbox.addEventListener('change', (e) => {
                    const isChecked = e.target.checked;
                    const tbody = table.querySelector('tbody');
                    const rowCheckboxes = tbody.querySelectorAll('input[type="checkbox"].hf-row-checkbox');
                    rowCheckboxes.forEach(cb => {
                        cb.checked = isChecked;
                        const rowId = cb.dataset.itemId;
                        if (isChecked) {
                            window.dashboardSelectedItems.add(rowId);
                        } else {
                            window.dashboardSelectedItems.delete(rowId);
                        }
                    });
                    updateBulkActionsVisibility();
                    updateSelectionCounter();
                });
                th.appendChild(checkbox);
            } else {
                th.textContent = h.text;
            }

            if (h.optional && !optionalColumnsVisible) {
                th.style.display = 'none';
            }
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        table.appendChild(createElement('tbody', { id: 'hf-dashboard-tbody' }));

        tableScroll.appendChild(table);
        tableSection.appendChild(tableScroll);
        tableSection.appendChild(bulkActionsContainer);
        wrapper.appendChild(tableSection);

        // Initialize table sorter
        const tableSorter = new TableSorter(table);

        // Rendering state
        let isRendering = false;
        let renderCancelled = false;

        // Update stats display
        function updateDashboardStats() {
            const isRunning = STATE.isProcessing;
            const isPaused = STATE.isPaused;

            const stats = {
                total: STATE.queue.length,
                pending: STATE.queue.filter(i => i.status === 'Pending').length,
                generating: STATE.queue.filter(i => i.status === 'Generating' || i.status.includes('Gen')).length,
                success: STATE.queue.filter(i => i.status === 'Success' || i.status === 'Downloaded' || i.status === 'Has Video').length,
                failed: STATE.queue.filter(i => i.status === 'Error' || i.status === 'Failed' || i.status === 'Download Error').length,
                paused: isPaused ? 1 : 0,
                stopped: !isRunning && !isPaused && STATE.queue.length > 0 ? 1 : 0
            };

            statItems.forEach(item => {
                const el = document.getElementById(`hf-stat-${item.key}`);
                const statItem = el?.closest('.hf-stat-item');
                if (el) {
                    const value = stats[item.key] || 0;
                    el.textContent = value;
                    // Hide stat item if value is 0 or idle
                    if (statItem) {
                        if (value === 0 || (item.key === 'stopped' && !stats.stopped)) {
                            statItem.style.display = 'none';
                        } else {
                            statItem.style.display = '';
                        }
                    }
                }
            });

            // Show/hide stats bar if queue is empty (total === 0) or all stats are zero
            const hasAnyStats = stats.total > 0 || Object.values(stats).some(v => v > 0);
            if (statsBar) {
                statsBar.style.display = hasAnyStats ? '' : 'none';
            }
        }

        // Populate table - safe rendering with validation
        function updateDashboardTable() {
            if (isRendering) return; // Prevent concurrent renders
            if (renderCancelled) return; // Respect cancellation

            isRendering = true;
            const tbody = table.querySelector('tbody');
            if (!tbody) {
                isRendering = false;
                return;
            }

            // Get search filter
            const searchFilter = window.dashboardSearchFilter || '';

            // Get active filter tabs
            const activeFilters = window.dashboardActiveFilters || new Set(['total']);

            // Get all existing rows or create them
            const existingRows = new Map();
            Array.from(tbody.querySelectorAll('tr')).forEach(row => {
                const rowId = row.id.replace('dashboard-row-', '');
                if (rowId) {
                    existingRows.set(rowId, row);
                }
            });

            // Create rows for items that don't exist yet
            STATE.queue.forEach(item => {
                if (!existingRows.has(item.id)) {
                    const row = document.createElement('tr');
                    row.id = `dashboard-row-${item.id}`;
                    row.className = 'hf-table-row';
                    existingRows.set(item.id, row);
                    tbody.appendChild(row);
                }
            });

            // Remove rows for items that no longer exist in queue
            existingRows.forEach((row, itemId) => {
                if (!STATE.queue.find(item => item.id === itemId)) {
                    row.remove();
                    existingRows.delete(itemId);
                }
            });

            // Build filtered items array for lightbox gallery (all visible items after filtering)
            const filteredItems = [];

            // Now update all rows - hide/show based on filters instead of removing
            STATE.queue.forEach(item => {
                if (renderCancelled) return; // Check cancellation during loop

                // Get or create row
                let row = existingRows.get(item.id);
                if (!row) {
                    row = document.createElement('tr');
                    row.id = `dashboard-row-${item.id}`;
                    row.className = 'hf-table-row';
                    tbody.appendChild(row);
                }

                // Check if row should be visible based on filters
                let shouldShow = true;

                // Apply search filter
                if (searchFilter) {
                    const searchLower = searchFilter.toLowerCase();
                    const matchesSearch =
                        (item.id && item.id.toLowerCase().includes(searchLower)) ||
                        (item.prompt && item.prompt.toLowerCase().includes(searchLower)) ||
                        (item.status && item.status.toLowerCase().includes(searchLower));
                    if (!matchesSearch) shouldShow = false;
                }

                // Apply filter tabs (stats-based)
                if (shouldShow && activeFilters.size > 0) {
                    if (activeFilters.has('total')) {
                        shouldShow = true; // Show all
                    } else if (activeFilters.has('pending')) {
                        shouldShow = item.status === 'Pending';
                    } else if (activeFilters.has('generating')) {
                        shouldShow = item.status === 'Generating' || item.status.includes('Gen');
                    } else if (activeFilters.has('success')) {
                        shouldShow = item.status === 'Success' || item.status === 'Downloaded' || item.status === 'Has Video';
                    } else if (activeFilters.has('failed')) {
                        shouldShow = item.status === 'Error' || item.status === 'Failed' || item.status === 'Download Error';
                    } else {
                        shouldShow = false;
                    }
                }

                // Hide/show row instead of removing
                if (shouldShow) {
                    row.style.display = '';
                    row.classList.remove('hf-row-hidden');
                    // Add to filtered items for lightbox gallery
                    filteredItems.push(item);
                } else {
                    row.style.display = 'none';
                    row.classList.add('hf-row-hidden');
                    // Skip updating content for hidden rows (they keep their old content)
                    return;
                }

                // Only update row content if visible (clear and rebuild)
                row.innerHTML = '';

                // Checkbox cell
                const checkboxCell = document.createElement('td');
                const checkbox = createElement('input', {
                    type: 'checkbox',
                    class: 'hf-row-checkbox',
                    'data-item-id': item.id
                });
                checkbox.checked = window.dashboardSelectedItems.has(item.id);
                checkbox.addEventListener('change', (e) => {
                    const rowId = item.id;
                    if (e.target.checked) {
                        window.dashboardSelectedItems.add(rowId);
                    } else {
                        window.dashboardSelectedItems.delete(rowId);
                    }
                    updateSelectAllCheckbox();
                    updateBulkActionsVisibility();
                    updateSelectionCounter();
                });
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);

                // Image preview - validate URL before rendering
                const imgCell = document.createElement('td');
                imgCell.className = 'hf-image-cell';

                // Validate image URL before attempting to render
                if (item.imgUrl && isValidUrl(item.imgUrl)) {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'hf-image-container';

                    const img = document.createElement('img');
                    img.className = 'hf-thumbnail';
                    img.loading = 'lazy';
                    img.decoding = 'async';

                    // Create fallback link
                    const fallbackLink = document.createElement('a');
                    fallbackLink.href = item.imgUrl;
                    fallbackLink.target = '_blank';
                    fallbackLink.rel = 'noopener noreferrer';
                    fallbackLink.className = 'hf-image-fallback';
                    fallbackLink.textContent = 'View Image';
                    fallbackLink.style.display = 'none';

                    // Error handling - non-blocking, single retry
                    let errorCount = 0;
                    img.onerror = () => {
                        errorCount++;
                        if (errorCount === 1) {
                            // Retry with explicit thumbnail URL
                            const fixedUrl = toDriveThumbnail(item.imgUrl);
                            if (fixedUrl !== img.src && isValidUrl(fixedUrl)) {
                                img.src = fixedUrl;
                                return;
                            }
                        }
                        // If still fails, show fallback link
                        img.style.display = 'none';
                        fallbackLink.style.display = 'inline-block';
                    };

                    img.onload = () => {
                        fallbackLink.style.display = 'none';
                    };

                    // Set src after handlers are attached — convert drive URLs first
                    requestAnimationFrame(() => {
                        if (renderCancelled) return;
                        try {
                            img.src = toDriveThumbnail(item.imgUrl);
                        } catch (e) {
                            console.warn('Failed to load image:', item.imgUrl, e);
                            img.style.display = 'none';
                            fallbackLink.style.display = 'inline-block';
                        }
                    });

                    // Lightbox click handler with gallery navigation
                    img.onclick = (e) => {
                        e.stopPropagation();
                        // Use filtered items from current scope or fallback to window global
                        const itemsForGallery = filteredItems.length > 0 ? filteredItems : (window.dashboardFilteredItems || STATE.queue);
                        showLightboxGallery(item, itemsForGallery);
                    };

                    imgContainer.appendChild(img);
                    imgContainer.appendChild(fallbackLink);
                    imgCell.appendChild(imgContainer);
                } else if (item.imgUrl) {
                    // Invalid URL - show button only
                    const viewBtn = document.createElement('a');
                    viewBtn.href = item.imgUrl;
                    viewBtn.target = '_blank';
                    viewBtn.rel = 'noopener noreferrer';
                    viewBtn.className = 'hf-image-fallback';
                    viewBtn.textContent = 'View URL';
                    viewBtn.setAttribute('data-invalid-url', 'true');
                    imgCell.appendChild(viewBtn);
                } else {
                    imgCell.textContent = '-';
                }

                // ID cell
                const idCell = createElement('td', {
                    'data-value': item.id,
                    class: 'id-cell'
                });
                idCell.textContent = item.id;
                row.appendChild(idCell);

                // Image cell
                row.appendChild(imgCell);

                // Prompt cell (truncated)
                const promptCell = createElement('td', {
                    'data-value': item.prompt,
                    class: 'prompt-cell',
                    title: item.prompt
                });
                const promptText = item.prompt.length > 80 ? item.prompt.substring(0, 80) + '...' : item.prompt;
                promptCell.textContent = promptText;
                row.appendChild(promptCell);

                // Status cell
                const statusCell = createElement('td');
                const statusBadge = createElement('span', {
                    class: `hf-status-badge status-${item.status.toLowerCase().split(' ')[0]}`
                });
                statusBadge.textContent = item.status;
                statusCell.appendChild(statusBadge);
                row.appendChild(statusCell);

                // Timestamp cell (optional)
                const timestampCell = createElement('td', {
                    'data-value': item.timestamp || '',
                    class: 'optional-column'
                });
                if (item.timestamp) {
                    const date = new Date(item.timestamp);
                    timestampCell.textContent = date.toLocaleString();
                    timestampCell.title = date.toISOString();
                } else {
                    timestampCell.textContent = '-';
                }
                if (!optionalColumnsVisible) timestampCell.style.display = 'none';
                row.appendChild(timestampCell);

                // Cell ID cell (optional)
                const cellIdCell = createElement('td', {
                    'data-value': item.cellId || '',
                    class: 'optional-column'
                });
                cellIdCell.textContent = item.cellId || '-';
                if (!optionalColumnsVisible) cellIdCell.style.display = 'none';
                row.appendChild(cellIdCell);

                // Filename cell (optional)
                const filenameCell = createElement('td', {
                    'data-value': item.filename || '',
                    class: 'optional-column hf-file-cell',
                    title: item.filename || ''
                });
                filenameCell.textContent = item.filename || '-';
                if (!optionalColumnsVisible) filenameCell.style.display = 'none';
                row.appendChild(filenameCell);

                // Visual highlighting for downloaded items
                const downloaded = HFStorage.getDownloadedFiles();
                if (downloaded.has(item.id)) {
                    row.classList.add('hf-downloaded');
                    row.setAttribute('data-downloaded', 'true');
                }

                // Actions cell
                const actionsCell = createElement('td', { class: 'actions-cell' });
                // Show download button for items with video URLs (Success or Has Video status)
                if (item.videoUrl && (item.status === 'Success' || item.status === 'Has Video' || item.status === 'Ready')) {
                    const downloadBtn = createElement('button', {
                        class: 'hf-btn hf-btn-icon btn-sm',
                        title: item.status === 'Has Video' ? 'Download video' : 'Re-download',
                        'data-tooltip': item.status === 'Has Video' ? 'Download video' : 'Re-download video'
                    });
                    downloadBtn.appendChild(createIcon('download', '12px'));
                    downloadBtn.addEventListener('click', () => {
                        if (item.videoUrl) {
                            downloadVideo(item.videoUrl, item, item.cellId);
                        }
                    });
                    actionsCell.appendChild(downloadBtn);
                }
                row.appendChild(actionsCell);
            });

            isRendering = false;
            console.log('[updateDashboardTable] Table updated, calling stats and filter updates');
            updateDashboardStats();
            updateFilterTabCounts();
            if (typeof updateStatsAndTabsVisibility === 'function') {
                updateStatsAndTabsVisibility();
            }

            // Store filtered items globally for lightbox gallery access
            window.dashboardFilteredItems = filteredItems;
        }

        // Initialize filter state
        window.dashboardActiveFilters = new Set(['total']);

        // Initial table render
        updateDashboardTable();
        isRendering = false;

        // Store update function for external access
        window.updateDashboardTable = () => {
            renderCancelled = false;
            updateDashboardTable();
            isRendering = false;
        };

        // Store cancel function
        window.cancelDashboardRender = () => {
            renderCancelled = true;
            isRendering = false;
        };

        // Auto-refresh during processing
        const autoRefreshInterval = setInterval(() => {
            if (STATE.isProcessing && !isRendering) {
                window.updateDashboardTable();
            }
            if (!STATE.isProcessing && !STATE.queue.some(i => i.status === 'Generating')) {
                clearInterval(autoRefreshInterval);
            }
        }, 2000);

        window.dashboardAutoRefresh = autoRefreshInterval;

        modal.setContent(wrapper);

        // Helper function to update modal button states based on data availability
        function updateModalButtonStates() {
            const hasQueueData = STATE.queue.length > 0;
            const hasTextareaData = textarea.value.trim().length > 0;
            const hasImportedData = STATE.queue.some(item => !item.cellId && !item.videoUrl && item.status !== 'Generating' && item.status !== 'Success');

            // Clear Imported button - only enable if there's imported data to clear
            const clearImportedBtn = modal.getModal().querySelector('[data-button="clear-imported"]');
            if (clearImportedBtn) {
                clearImportedBtn.disabled = !hasImportedData;
            }

            // Import & Start button - only enable if there's textarea data
            const importStartBtn = modal.getModal().querySelector('[data-button="import-start"]');
            if (importStartBtn) {
                importStartBtn.disabled = !hasTextareaData;
            }

            // Export buttons - only enable if there's queue data
            const exportCsvBtn = document.getElementById('hf-dashboard-export');
            if (exportCsvBtn) {
                exportCsvBtn.disabled = !hasQueueData;
            }
            const exportJsonBtn = document.getElementById('hf-dashboard-export-json');
            if (exportJsonBtn) {
                exportJsonBtn.disabled = !hasQueueData;
            }
        }

        // Use modal.addButtons() with SmartButton system
        const modalButtons = [
            {
                text: 'Clear Imported',
                icon: 'trash-outline',
                classes: ['hf-btn', 'btn-stop'],
                tooltip: 'Clear imported data',
                'data-button': 'clear-imported',
                onClick: () => {
                    console.log('[Button] Clear Imported clicked');
                    try {
                        cancelImport();
                        if (window.updateDashboardTable) {
                            window.updateDashboardTable();
                        }
                        updateModalButtonStates();
                        toastManager.success('Imported data cleared');
                    } catch (error) {
                        console.error('[Button] Error in cancelImport:', error);
                        toastManager.error('Failed to clear imported data: ' + error.message);
                    }
                },
                position: 'left'
            },
            {
                text: 'Import & Start',
                icon: 'play',
                classes: ['hf-btn', 'btn-primary'],
                tooltip: 'Import CSV and start queue',
                'data-button': 'import-start',
                onClick: async () => {
                    console.log('[Button] Import & Start clicked');
                    try {
                        const csvData = textarea.value.trim();
                        if (csvData) {
                            // Show confirmation dialog
                            const lineCount = csvData.split('\n').filter(line => line.trim()).length;
                            const confirmed = await toastManager.confirm(
                                `Are you sure you want to import ${lineCount} item(s) and start the queue?`,
                                {
                                    title: 'Confirm Import & Start',
                                    confirmText: 'Import & Start',
                                    cancelText: 'Cancel'
                                }
                            );

                            if (!confirmed) {
                                toastManager.info('Import cancelled');
                                return;
                            }

                            // Properly submit textarea content with event dispatching for preview
                            await submitTextareaContent(textarea, csvData);

                            renderCancelled = false;
                            parseAndImportCSV(csvData);
                            if (window.updateDashboardTable) {
                                window.updateDashboardTable();
                            }
                            updateModalButtonStates();
                            if (window.dashboardAutoRefresh) {
                                clearInterval(window.dashboardAutoRefresh);
                            }
                            modal.close();
                            const pendingCount = STATE.queue.filter(item => item.status === 'Pending').length;
                            if (pendingCount > 0) {
                                startQueue();
                            } else {
                                toastManager.warning('No pending items to generate. Items with video URLs are marked as "Has Video" and can be downloaded separately.');
                            }
                        } else {
                            toastManager.warning('Please paste CSV data or import a file');
                        }
                    } catch (error) {
                        console.error('[Button] Error in Import & Start:', error);
                        toastManager.error('Failed to import: ' + error.message);
                    }
                },
                position: 'right'
            },
            {
                text: 'Export CSV',
                icon: 'download',
                id: 'hf-dashboard-export',
                classes: ['hf-btn', 'btn-success'],
                tooltip: 'Export queue to CSV',
                onClick: () => {
                    console.log('[Button] Export CSV clicked');
                    try {
                        exportData();
                    } catch (error) {
                        console.error('[Button] Error in exportData:', error);
                        toastManager.error('Failed to export: ' + error.message);
                    }
                },
                position: 'right'
            },
            {
                text: 'Export JSON',
                icon: 'document',
                id: 'hf-dashboard-export-json',
                classes: ['hf-btn', 'btn-secondary'],
                tooltip: 'Export queue to JSON',
                onClick: () => {
                    console.log('[Button] Export JSON clicked');
                    try {
                        exportDataJSON();
                    } catch (error) {
                        console.error('[Button] Error in exportDataJSON:', error);
                        toastManager.error('Failed to export JSON: ' + error.message);
                    }
                },
                position: 'right'
            }
        ];

        modal.addButtons(modalButtons);

        // Update button states after modal is shown
        setTimeout(() => {
            updateModalButtonStates();
        }, 100);

        // Empty state message - integrate input section
        const emptyMsg = createElement('div', {
            id: 'hf-dashboard-empty',
            class: 'hf-track-empty loading_wrapper'
        });

        // Add icon
        emptyMsg.appendChild(createIcon('list-outline', '48px'));

        // Add message
        const emptyP = createElement('p', {
            text: 'No items in queue. Import data to get started.'
        });
        emptyMsg.appendChild(emptyP);

        // Add input section (with Import CSV button, hidden file input and textarea)
        emptyMsg.appendChild(inputSection);

        // Show/hide based on queue length
        emptyMsg.style.display = STATE.queue.length === 0 ? '' : 'none';
        wrapper.appendChild(emptyMsg);

        // Wrap updateDashboardTable to also update button states and empty state
        const originalUpdateDashboardTable = updateDashboardTable;
        updateDashboardTable = function () {
            originalUpdateDashboardTable();
            updateModalButtonStates();
            if (emptyMsg) {
                emptyMsg.style.display = STATE.queue.length === 0 ? '' : 'none';
            }
        };

        // If textarea already has content when modal opens, trigger preview after modal is shown
        modal.show();
        if (textarea.value.trim()) {
            // Wait for modal to fully render, then trigger preview
            setTimeout(() => {
                triggerPreview(textarea.value.trim());
            }, 300);
        }
    }

    // Lightbox Gallery with navigation and metadata
    /**
     * Show Pre-Fetch Bulk Download Modal
     * Displays a table of pre-fetched videos with bulk actions
     */
    async function showPreFetchModal() {
        logInfo('Opening Pre-Fetch Bulk Download modal...');

        // Check if pre-fetch is currently running
        if (window.prefetchState && window.prefetchState.isRunning) {
            toastManager.warning('Pre-fetch is already running. Please wait for it to complete.');
            return;
        }

        // Check if we already have prefetched data
        const existingData = window.prefetchedVideosData;
        let prefetchedVideos = existingData || [];

        if (prefetchedVideos.length > 0) {
            logInfo(`Using existing prefetched data: ${prefetchedVideos.length} videos`);
            toastManager.info(`Showing ${prefetchedVideos.length} previously fetched videos`);
        } else {
            // No existing data, fetch new
            toastManager.info('Discovering generated videos from DOM...');
            prefetchedVideos = await prefetchAllGeneratedVideos();

            if (prefetchedVideos.length === 0) {
                toastManager.warning('No generated videos found in the DOM');
                return;
            }
        }

        const modal = new HFModalBuilder('Pre-Fetch Bulk Download', {
            maxWidth: '95vw',
            customClasses: ['hf-prefetch-modal', 'hf-track-modal-content']
        });

        const wrapper = createElement('div', { class: 'hf-track-modal-content hf-prefetch-modal-content', id: 'hf-prefetch-modal-content' });

        // Stats bar - reuse hf-queue-stats class
        const statsBar = createElement('div', { class: 'hf-queue-stats hf-prefetch-stats', id: 'hf-prefetch-stats' });
        const totalStat = createElement('div', { class: 'hf-stat-item', id: 'hf-prefetch-stat-total' });
        totalStat.appendChild(createIcon('list', '12px'));
        totalStat.appendChild(createElement('span', { class: 'hf-stat-label', text: 'Total Videos:' }));
        totalStat.appendChild(createElement('span', { class: 'hf-stat-value', id: 'hf-prefetch-total', text: String(prefetchedVideos.length) }));
        statsBar.appendChild(totalStat);

        const selectedStat = createElement('div', { class: 'hf-stat-item', id: 'hf-prefetch-stat-selected' });
        selectedStat.appendChild(createIcon('checkmark-circle', '12px'));
        selectedStat.appendChild(createElement('span', { class: 'hf-stat-label', text: 'Selected:' }));
        selectedStat.appendChild(createElement('span', { class: 'hf-stat-value', id: 'hf-prefetch-selected', text: '0' }));
        statsBar.appendChild(selectedStat);

        const duplicateStat = createElement('div', { class: 'hf-stat-item', id: 'hf-prefetch-stat-duplicates' });
        duplicateStat.appendChild(createIcon('copy-outline', '12px'));
        duplicateStat.appendChild(createElement('span', { class: 'hf-stat-label', text: 'Duplicates:' }));
        duplicateStat.appendChild(createElement('span', { class: 'hf-stat-value', id: 'hf-prefetch-duplicates', text: '0' }));
        statsBar.appendChild(duplicateStat);

        wrapper.appendChild(statsBar);

        // Filter bar - reuse hf-track-filter-bar class
        const filterBar = createElement('div', { class: 'hf-track-filter-bar hf-prefetch-filter-bar', id: 'hf-prefetch-filter-bar' });

        // Search container - reuse hf-track-search class
        const searchContainer = createElement('div', { class: 'hf-track-search hf-prefetch-search', id: 'hf-prefetch-search-container' });
        const searchInput = createElement('input', {
            type: 'text',
            placeholder: 'Search by prompt, cell ID, or status...',
            id: 'hf-prefetch-search',
            class: 'hf-input'
        });
        let searchFilter = '';
        searchInput.addEventListener('input', (e) => {
            searchFilter = e.target.value.toLowerCase();
            updatePreFetchTable();
        });
        searchContainer.appendChild(createIcon('search'));
        searchContainer.appendChild(searchInput);
        filterBar.appendChild(searchContainer);

        // Duplicate filter toggle
        const duplicateToggle = createElement('label', { class: 'hf-checkbox-label', id: 'hf-prefetch-duplicate-toggle' });
        const duplicateCheckbox = createElement('input', {
            type: 'checkbox',
            id: 'hf-prefetch-filter-duplicates',
            class: 'hf-checkbox'
        });
        duplicateCheckbox.addEventListener('change', () => {
            updatePreFetchTable();
        });
        duplicateToggle.appendChild(duplicateCheckbox);
        duplicateToggle.appendChild(createElement('span', { text: 'Hide duplicates' }));
        filterBar.appendChild(duplicateToggle);

        wrapper.appendChild(filterBar);

        // Table section - reuse hf-table-scroll class
        const tableScroll = createElement('div', { class: 'hf-table-scroll hf-prefetch-table-scroll', id: 'hf-prefetch-table-scroll' });
        const table = createElement('table', {
            id: 'hf-prefetch-table',
            class: 'hf-table'
        });

        const thead = createElement('thead');
        const headerRow = createElement('tr');
        const headers = [
            { key: 'select', text: '', sortable: false, checkbox: true },
            { key: 'thumbnail', text: 'Thumb', sortable: false },
            { key: 'prompt', text: 'Prompt', sortable: true },
            { key: 'videoUrl', text: 'Video URL', sortable: true },
            { key: 'cellId', text: 'Cell ID', sortable: true, optional: true },
            { key: 'status', text: 'Status', sortable: true }
        ];

        headers.forEach(h => {
            const th = createElement('th', {
                'data-sort-key': h.sortable ? h.key : null
            });
            if (h.checkbox) {
                th.className = 'select-head';
                const checkbox = createElement('input', {
                    type: 'checkbox',
                    id: 'hf-prefetch-select-all',
                    class: 'hf-bulk-select-checkbox queue-select-checkbox'
                });
                checkbox.addEventListener('change', (e) => {
                    const isChecked = e.target.checked;
                    const tbody = document.getElementById('hf-prefetch-tbody');
                    if (!tbody) return;
                    const rowCheckboxes = tbody.querySelectorAll('input[type="checkbox"].hf-prefetch-row-checkbox');
                    rowCheckboxes.forEach(cb => {
                        cb.checked = isChecked;
                        const videoIndex = parseInt(cb.dataset.videoIndex);
                        if (isChecked) {
                            window.prefetchSelectedItems.add(videoIndex);
                        } else {
                            window.prefetchSelectedItems.delete(videoIndex);
                        }
                    });
                    updatePreFetchSelection();
                });
                th.appendChild(checkbox);
            } else {
                th.textContent = h.text;
                if (h.optional) {
                    th.className = 'optional-column';
                }
            }
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        table.appendChild(createElement('tbody', { id: 'hf-prefetch-tbody' }));
        tableScroll.appendChild(table);
        wrapper.appendChild(tableScroll);

        // Track selected items
        window.prefetchSelectedItems = window.prefetchSelectedItems || new Set();

        // Store filtered videos for bulk actions - use window to persist across function calls
        window.prefetchedVideosData = prefetchedVideos;
        let currentFilteredVideos = prefetchedVideos;

        // Update selection counter
        function updatePreFetchSelection() {
            const selectedCount = window.prefetchSelectedItems.size;
            const selectedEl = document.getElementById('hf-prefetch-selected');
            if (selectedEl) {
                selectedEl.textContent = String(selectedCount);
            }
        }

        // Populate table
        function updatePreFetchTable() {
            const tbody = document.getElementById('hf-prefetch-tbody');
            if (!tbody) {
                logWarning('updatePreFetchTable: tbody not found');
                return;
            }

            tbody.innerHTML = '';

            // Get videos from window storage (persists across function calls)
            const videos = window.prefetchedVideosData || prefetchedVideos;
            if (!videos || videos.length === 0) {
                logWarning('updatePreFetchTable: No videos to display');
                return;
            }

            // Filter videos
            let filtered = videos;

            // Apply search filter
            if (searchFilter) {
                filtered = filtered.filter(video => {
                    const searchLower = searchFilter.toLowerCase();
                    return (
                        (video.prompt && video.prompt.toLowerCase().includes(searchLower)) ||
                        (video.cellId && video.cellId.toLowerCase().includes(searchLower)) ||
                        (video.dataIndex && String(video.dataIndex).toLowerCase().includes(searchLower)) ||
                        (video.status && video.status.toLowerCase().includes(searchLower)) ||
                        (video.videoUrl && video.videoUrl.toLowerCase().includes(searchLower))
                    );
                });
            }

            // Calculate duplicates count
            const seenUrls = new Map();
            const duplicateCount = videos.filter(video => {
                if (!video.videoUrl) return false;
                if (seenUrls.has(video.videoUrl)) {
                    return true; // This is a duplicate
                }
                seenUrls.set(video.videoUrl, true);
                return false;
            }).length;

            // Update duplicate stat
            const duplicateStatEl = document.getElementById('hf-prefetch-duplicates');
            if (duplicateStatEl) {
                duplicateStatEl.textContent = String(duplicateCount);
            }

            // Filter duplicates if enabled
            if (duplicateCheckbox.checked) {
                const seenUrlsFilter = new Map();
                filtered = filtered.filter(video => {
                    if (!video.videoUrl) return true;
                    if (seenUrlsFilter.has(video.videoUrl)) {
                        return false; // Duplicate
                    }
                    seenUrlsFilter.set(video.videoUrl, true);
                    return true;
                });
            }

            // Update total stat
            const totalStatEl = document.getElementById('hf-prefetch-total');
            if (totalStatEl) {
                totalStatEl.textContent = String(filtered.length);
            }

            // Store filtered videos for bulk actions
            currentFilteredVideos = filtered;

            // Render rows
            filtered.forEach((video, index) => {
                const row = document.createElement('tr');
                row.className = 'hf-table-row';

                // Checkbox cell
                const checkboxCell = document.createElement('td');
                checkboxCell.className = 'select-cell';
                const checkbox = createElement('input', {
                    type: 'checkbox',
                    class: 'queue-row-checkbox hf-prefetch-row-checkbox',
                    id: `hf-prefetch-checkbox-${index}`,
                    'data-video-index': String(index)
                });
                checkbox.checked = window.prefetchSelectedItems.has(index);
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        window.prefetchSelectedItems.add(index);
                    } else {
                        window.prefetchSelectedItems.delete(index);
                    }
                    updatePreFetchSelection();
                });
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);

                // Thumbnail cell
                const thumbnailCell = document.createElement('td');
                thumbnailCell.className = 'hf-image-cell';
                thumbnailCell.id = `hf-prefetch-thumbnail-${index}`;
                if (video.thumbnailUrl) {
                    const img = document.createElement('img');
                    img.className = 'hf-thumbnail';
                    img.src = video.thumbnailUrl;
                    img.loading = 'lazy';
                    thumbnailCell.appendChild(img);
                } else {
                    thumbnailCell.textContent = '-';
                }
                row.appendChild(thumbnailCell);

                // Prompt cell
                const promptCell = createElement('td', {
                    'data-value': video.prompt || '',
                    class: 'prompt-cell',
                    id: `hf-prefetch-prompt-${index}`,
                    title: video.prompt || ''
                });
                const promptText = video.prompt && video.prompt.length > 0
                    ? (video.prompt.length > 80 ? video.prompt.substring(0, 80) + '...' : video.prompt)
                    : 'No prompt available';
                promptCell.textContent = promptText;
                row.appendChild(promptCell);

                // Video URL cell
                const urlCell = createElement('td', {
                    'data-value': video.videoUrl,
                    class: 'url-cell download-url-cell',
                    id: `hf-prefetch-url-${index}`
                });
                if (video.videoUrl) {
                    const urlLink = document.createElement('a');
                    urlLink.href = video.videoUrl;
                    urlLink.target = '_blank';
                    urlLink.rel = 'noopener noreferrer';
                    urlLink.textContent = video.videoUrl.substring(0, 60) + '...';
                    urlLink.title = video.videoUrl;
                    urlCell.appendChild(urlLink);
                } else {
                    urlCell.textContent = '-';
                }
                row.appendChild(urlCell);

                // Cell ID cell (optional, smaller)
                const cellIdCell = createElement('td', {
                    'data-value': video.cellId || video.dataIndex || '',
                    class: 'cell-id-cell optional-column',
                    id: `hf-prefetch-cellid-${index}`,
                    style: 'max-width: 30px; font-size: 0.75em;'
                });
                const cellIdText = video.cellId || video.dataIndex || '-';
                cellIdCell.textContent = cellIdText.length > 8 ? cellIdText.substring(0, 8) + '...' : cellIdText;
                cellIdCell.title = cellIdText; // Full ID on hover
                row.appendChild(cellIdCell);

                // Status cell
                const statusCell = createElement('td');
                statusCell.className = 'status-cell';
                statusCell.id = `hf-prefetch-status-${index}`;
                const statusBadge = createElement('span', {
                    class: `hf-status-badge status-${video.status.toLowerCase()}`
                });
                statusBadge.textContent = video.status;
                statusCell.appendChild(statusBadge);
                row.appendChild(statusCell);

                tbody.appendChild(row);
            });
        }

        // Extract video URLs on-demand (using grid layout)
        async function extractVideoUrlsOnDemand(selectedOnly = false) {
            const videos = window.prefetchedVideosData || prefetchedVideos;
            let videosToProcess = selectedOnly
                ? Array.from(window.prefetchSelectedItems).map(idx => currentFilteredVideos[idx]).filter(Boolean)
                : currentFilteredVideos;

            // Filter to only items without video URLs
            videosToProcess = videosToProcess.filter(v => !v.videoUrl);

            if (videosToProcess.length === 0) {
                toastManager.info('All selected items already have video URLs');
                return;
            }

            toastManager.info(`Extracting video URLs for ${videosToProcess.length} item(s)...`);
            logInfo(`Extracting video URLs on-demand for ${videosToProcess.length} items`);

            // Switch to grid layout for better hover extraction
            logInfo('Switching to grid layout for video extraction...');
            await switchToGridLayout();
            await sleep(1000); // Additional wait for layout to fully switch

            const container = findGridContainer();
            if (!container) {
                toastManager.error('Grid container not found');
                return;
            }

            let successCount = 0;
            let failCount = 0;

            // Process in small batches to avoid overwhelming
            const batchSize = 2;
            for (let i = 0; i < videosToProcess.length; i += batchSize) {
                const batch = videosToProcess.slice(i, i + batchSize);

                await Promise.all(batch.map(async (video) => {
                    try {
                        let cellId = video.cellId;
                        let figure = null;

                        // First try to find by cellId if available
                        if (cellId) {
                            figure = container.querySelector(`figure[data-cell-id="${cellId}"]`);
                        }

                        // If not found by cellId, try to find by data-index (fallback for list layout items)
                        if (!figure && video.dataIndex !== null && video.dataIndex !== undefined) {
                            // In grid layout, try to find element with matching data-index or look for nested structure
                            const allFigures = container.querySelectorAll('figure[data-cell-id]');
                            for (const fig of allFigures) {
                                // Check if this figure is associated with the data-index
                                // We can try to match by thumbnail URL if available
                                if (video.thumbnailUrl) {
                                    const figImg = fig.querySelector('img[src*="cloudfront"]');
                                    if (figImg && figImg.src === video.thumbnailUrl) {
                                        figure = fig;
                                        cellId = fig.getAttribute('data-cell-id');
                                        break;
                                    }
                                }
                            }

                            // If still not found, try finding by data-index attribute (might be on parent)
                            if (!figure) {
                                const indexElement = container.querySelector(`[data-index="${video.dataIndex}"]`);
                                if (indexElement) {
                                    const nestedFigure = indexElement.querySelector('figure[data-cell-id]');
                                    if (nestedFigure) {
                                        figure = nestedFigure;
                                        cellId = nestedFigure.getAttribute('data-cell-id');
                                    }
                                }
                            }
                        }

                        if (!figure || !cellId) {
                            logWarning(`Could not find figure element for video ${video.dataIndex || 'unknown'}. cellId: ${video.cellId || 'none'}, dataIndex: ${video.dataIndex || 'none'}`);
                            failCount++;
                            return;
                        }

                        // Extract video URL using hover simulation
                        const videoUrl = await extractVideoFromCell(figure);
                        if (videoUrl) {
                            video.videoUrl = videoUrl;
                            video.status = 'completed';
                            successCount++;
                            logInfo(`Extracted video URL for ${cellId}`);
                        } else {
                            video.status = 'generating';
                            failCount++;
                            logWarning(`No video URL found for ${cellId}`);
                        }
                    } catch (error) {
                        logError(`Error extracting video URL: ${error.message}`, { error });
                        failCount++;
                    }
                }));

                // Update table after each batch
                updatePreFetchTable();

                // Small delay between batches
                await sleep(300);
            }

            // Update stored data
            window.prefetchedVideosData = videos;

            toastManager.success(`Video URL extraction complete: ${successCount} success, ${failCount} failed`);
            logSuccess(`Video URL extraction complete: ${successCount} success, ${failCount} failed`);
        }

        // Bulk actions
        function bulkDownloadSelected() {
            const selectedIndices = Array.from(window.prefetchSelectedItems);
            const selectedVideos = selectedIndices.map(idx => currentFilteredVideos[idx]).filter(Boolean);
            const videosWithUrls = selectedVideos.filter(v => v.videoUrl);

            if (videosWithUrls.length === 0) {
                toastManager.warning('No selected videos have video URLs');
                return;
            }

            toastManager.info(`Starting bulk download of ${videosWithUrls.length} video(s)...`);

            // Temporarily enable auto-download
            const originalAutoDownload = HFStorage.getAutoDownload();
            HFStorage.setAutoDownload(true);

            let successCount = 0;
            let errorCount = 0;

            videosWithUrls.forEach((video, index) => {
                setTimeout(() => {
                    // Create a temporary queue item for download
                    const tempItem = {
                        id: video.cellId || video.dataIndex || `prefetch-${index}`,
                        prompt: video.prompt,
                        imgUrl: video.thumbnailUrl || '',
                        status: 'Ready',
                        videoUrl: video.videoUrl,
                        cellId: video.cellId || null,
                        timestamp: video.discoveredAt || Date.now()
                    };

                    try {
                        downloadVideo(video.videoUrl, tempItem, video.cellId);
                        successCount++;
                    } catch (error) {
                        console.error(`[bulkDownload] Error downloading video ${index}:`, error);
                        errorCount++;
                    }

                    // After all downloads are initiated
                    if (index === videosWithUrls.length - 1) {
                        setTimeout(() => {
                            HFStorage.setAutoDownload(originalAutoDownload);
                            if (successCount > 0) {
                                toastManager.success(`Initiated download for ${successCount} video(s)${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
                            }
                        }, 500);
                    }
                }, index * 100);
            });
        }

        function exportPrefetchCSV() {
            const videos = window.prefetchedVideosData || prefetchedVideos;
            const csv = [
                ['Thumbnail URL', 'Prompt', 'Video URL', 'Cell ID', 'Data Index', 'Status', 'Discovered At'],
                ...videos.map(v => [
                    v.thumbnailUrl || '',
                    `"${(v.prompt || '').replace(/"/g, '""')}"`,
                    v.videoUrl || '',
                    v.cellId || '',
                    v.dataIndex || '',
                    v.status || '',
                    v.discoveredAt ? new Date(v.discoveredAt).toISOString() : ''
                ])
            ].map(row => row.join(',')).join('\n');

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `higgsfield-prefetch-${Date.now()}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toastManager.success('Pre-fetch data exported to CSV');
        }

        function exportPrefetchJSON() {
            const videos = window.prefetchedVideosData || prefetchedVideos;
            const data = {
                exportDate: new Date().toISOString(),
                version: '1.0',
                videos: videos
            };
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `higgsfield-prefetch-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toastManager.success('Pre-fetch data exported to JSON');
        }

        function clearPrefetchData() {
            toastManager.confirm('Are you sure you want to clear the pre-fetch data? This will close the modal.', {
                title: 'Clear Pre-Fetch Data',
                type: 'warning'
            }).then(confirmed => {
                if (confirmed) {
                    window.prefetchSelectedItems.clear();
                    window.prefetchedVideosData = null; // Clear the stored data
                    modal.close();
                    toastManager.success('Pre-fetch data cleared');
                }
            });
        }

        modal.setContent(wrapper);

        // Initialize table sorter
        new TableSorter(table);

        // Initialize table after modal content is set
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            updatePreFetchTable();
        });

        modal.addButtons([
            {
                text: 'Clear',
                icon: 'trash-outline',
                classes: ['hf-btn', 'btn-stop'],
                tooltip: 'Clear pre-fetch data',
                onClick: clearPrefetchData,
                position: 'left'
            },
            {
                text: 'Extract Video URLs',
                icon: 'videocam',
                classes: ['hf-btn', 'btn-info'],
                tooltip: 'Extract video URLs for selected items (uses grid layout)',
                onClick: () => extractVideoUrlsOnDemand(true),
                position: 'left'
            },
            {
                text: 'Extract All URLs',
                icon: 'videocam-outline',
                classes: ['hf-btn', 'btn-secondary'],
                tooltip: 'Extract video URLs for all items without URLs',
                onClick: () => extractVideoUrlsOnDemand(false),
                position: 'left'
            },
            {
                text: 'Download Selected',
                icon: 'cloud-download',
                classes: ['hf-btn', 'btn-primary'],
                tooltip: 'Download selected videos',
                onClick: bulkDownloadSelected,
                position: 'right'
            },
            {
                text: 'Export CSV',
                icon: 'download',
                classes: ['hf-btn', 'btn-success'],
                tooltip: 'Export to CSV',
                onClick: exportPrefetchCSV,
                position: 'right'
            },
            {
                text: 'Export JSON',
                icon: 'document',
                classes: ['hf-btn', 'btn-secondary'],
                tooltip: 'Export to JSON',
                onClick: exportPrefetchJSON,
                position: 'right'
            }
        ]);

        modal.show();
    }

    function showLightboxGallery(currentItem, allItems) {
        const currentIndex = allItems.findIndex(item => item.id === currentItem.id);
        let currentIdx = currentIndex >= 0 ? currentIndex : 0;

        const lightbox = document.createElement('div');
        lightbox.className = 'hf-lightbox';
        lightbox.id = 'hf-lightbox-gallery';

        const lightboxContent = document.createElement('div');
        lightboxContent.className = 'hf-lightbox-content';
        lightboxContent.onclick = (e) => {
            if (e.target === lightboxContent || e.target.classList.contains('hf-lightbox-image')) {
                lightbox.remove();
            }
        };

        const closeBtn = document.createElement('button');
        closeBtn.className = 'hf-lightbox-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => lightbox.remove();

        const prevBtn = document.createElement('button');
        prevBtn.className = 'hf-lightbox-nav hf-lightbox-prev';
        prevBtn.appendChild(createIcon('chevron-back', '24px'));
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            if (currentIdx > 0) {
                currentIdx--;
                updateLightboxContent(allItems[currentIdx], lightboxContent, currentIdx, allItems.length);
            }
        };

        const nextBtn = document.createElement('button');
        nextBtn.className = 'hf-lightbox-nav hf-lightbox-next';
        nextBtn.appendChild(createIcon('chevron-forward', '24px'));
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            if (currentIdx < allItems.length - 1) {
                currentIdx++;
                updateLightboxContent(allItems[currentIdx], lightboxContent, currentIdx, allItems.length);
            }
        };

        const metadataPanel = document.createElement('div');
        metadataPanel.className = 'hf-lightbox-metadata';

        function updateLightboxContent(item, container, index, total) {
            container.innerHTML = '';

            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'hf-lightbox-image-wrapper';

            const fullImg = document.createElement('img');
            fullImg.className = 'hf-lightbox-image';
            const thumbnailUrl = toDriveThumbnail(item.imgUrl);
            fullImg.src = thumbnailUrl.replace('&sz=w300', '&sz=w1920');
            fullImg.onerror = () => {
                fullImg.alt = 'Failed to load image';
                fullImg.style.display = 'none';
                const errorMsg = document.createElement('div');
                errorMsg.className = 'hf-lightbox-error';
                errorMsg.textContent = 'Image failed to load. Click to open in new tab.';
                errorMsg.onclick = () => window.open(item.imgUrl, '_blank');
                imageWrapper.appendChild(errorMsg);
            };
            imageWrapper.appendChild(fullImg);
            container.appendChild(imageWrapper);

            // Update metadata
            metadataPanel.innerHTML = '';

            const metadataTitle = document.createElement('div');
            metadataTitle.className = 'hf-lightbox-metadata-title';
            metadataTitle.textContent = `Image ${index + 1} of ${total}`;
            metadataPanel.appendChild(metadataTitle);

            if (item.prompt) {
                const promptDiv = document.createElement('div');
                promptDiv.className = 'hf-lightbox-metadata-item';
                const promptLabel = document.createElement('span');
                promptLabel.className = 'hf-lightbox-metadata-label';
                promptLabel.textContent = 'Prompt:';
                const promptText = document.createElement('span');
                promptText.className = 'hf-lightbox-metadata-value';
                promptText.textContent = item.prompt.length > 100 ? item.prompt.substring(0, 100) + '...' : item.prompt;
                promptDiv.appendChild(promptLabel);
                promptDiv.appendChild(promptText);
                metadataPanel.appendChild(promptDiv);
            }

            if (item.status) {
                const statusDiv = document.createElement('div');
                statusDiv.className = 'hf-lightbox-metadata-item';
                const statusLabel = document.createElement('span');
                statusLabel.className = 'hf-lightbox-metadata-label';
                statusLabel.textContent = 'Status:';
                const statusBadge = document.createElement('span');
                statusBadge.className = `hf-status-badge status-${item.status.toLowerCase().split(' ')[0]}`;
                statusBadge.textContent = item.status;
                statusDiv.appendChild(statusLabel);
                statusDiv.appendChild(statusBadge);
                metadataPanel.appendChild(statusDiv);
            }

            if (item.id) {
                const idDiv = document.createElement('div');
                idDiv.className = 'hf-lightbox-metadata-item';
                const idLabel = document.createElement('span');
                idLabel.className = 'hf-lightbox-metadata-label';
                idLabel.textContent = 'ID:';
                const idText = document.createElement('span');
                idText.className = 'hf-lightbox-metadata-value';
                idText.textContent = item.id;
                idDiv.appendChild(idLabel);
                idDiv.appendChild(idText);
                metadataPanel.appendChild(idDiv);
            }

            const urlBtn = document.createElement('button');
            urlBtn.className = 'hf-btn btn-primary hf-lightbox-url-btn';
            urlBtn.appendChild(createIcon('open-outline', '14px'));
            urlBtn.appendChild(createElement('span', { text: 'Open Image URL' }));
            urlBtn.onclick = (e) => {
                e.stopPropagation();
                window.open(item.imgUrl, '_blank');
            };
            metadataPanel.appendChild(urlBtn);

            container.appendChild(metadataPanel);

            // Update navigation buttons
            prevBtn.style.display = index > 0 ? 'flex' : 'none';
            nextBtn.style.display = index < total - 1 ? 'flex' : 'none';
        }

        lightbox.appendChild(closeBtn);
        lightbox.appendChild(prevBtn);
        lightbox.appendChild(nextBtn);
        lightbox.appendChild(lightboxContent);
        document.body.appendChild(lightbox);

        // Initial content
        updateLightboxContent(allItems[currentIdx], lightboxContent, currentIdx, allItems.length);

        // Keyboard navigation
        const handleKeyDown = (e) => {
            if (lightbox.parentElement) {
                if (e.key === 'Escape') {
                    lightbox.remove();
                } else if (e.key === 'ArrowLeft' && currentIdx > 0) {
                    currentIdx--;
                    updateLightboxContent(allItems[currentIdx], lightboxContent, currentIdx, allItems.length);
                } else if (e.key === 'ArrowRight' && currentIdx < allItems.length - 1) {
                    currentIdx++;
                    updateLightboxContent(allItems[currentIdx], lightboxContent, currentIdx, allItems.length);
                }
            } else {
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup on remove
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.removedNodes.length > 0) {
                    mutation.removedNodes.forEach((node) => {
                        if (node === lightbox) {
                            document.removeEventListener('keydown', handleKeyDown);
                            observer.disconnect();
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true });
    }

    function handleCSVImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        logInfo(`CSV import started: ${file.name}`);
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvData = e.target.result;
            parseAndImportCSV(csvData);
            document.getElementById('hf-input').value = csvData;
            // Update button states after setting textarea value (parseAndImportCSV also calls it, but this ensures it's updated)
            updateButtonStates();
            toastManager.success('CSV imported successfully');
        };
        reader.onerror = () => {
            logError('Failed to read CSV file');
            toastManager.error('Failed to read CSV file');
        };
        reader.readAsText(file);
    }

    /**************************************************************
     *   CSV PARSER - Handles quoted fields properly
     **************************************************************/
    function parseCSVLine(line, delimiter = ',') {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                }
            } else if (char === delimiter && !inQuotes) {
                // Field separator
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        // Add last field
        result.push(current.trim());
        return result;
    }

    function isValidUrl(str) {
        if (!str || typeof str !== 'string') return false;
        return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('//');
    }

    // Convert any Google Drive /file/d/ID/view URL → working thumbnail URL
    // Pattern: https://drive.google.com/thumbnail?id=<ID>&sz=w300
    function toDriveThumbnail(url) {
        if (!url) return url;
        const match = url.match(/\/file\/d\/([^\/]+)/);
        if (match) {
            return 'https://drive.google.com/thumbnail?id=' + match[1] + '&sz=w300';
        }
        // Already a thumbnail URL but missing &sz= — append it
        if (url.includes('/thumbnail?id=') && !url.includes('&sz=')) {
            return url.split('?usp=')[0] + '&sz=w300';
        }
        return url;
    }

    async function parseAndImportCSV(csvData) {
        logInfo('Parsing CSV data...');
        toastManager.info('Starting CSV import...');

        const lines = csvData.split('\n').filter(line => line.trim());
        const parsed = [];
        const duplicates = [];
        const alreadyGenerated = [];
        const skippedByStatus = [];

        if (lines.length === 0) {
            logWarning('No data found in CSV');
            toastManager.warning('No data found in CSV');
            return;
        }

        // Show progress: detecting delimiter
        toastManager.info(`Detecting CSV format... (${lines.length} lines)`);

        // Detect delimiter (tab or comma)
        const firstLine = lines[0];
        const isTabDelimited = firstLine.includes('\t') && !firstLine.match(/,"/);
        const delimiter = isTabDelimited ? '\t' : ',';

        // Find column indices by header - use proper CSV parsing
        let COL_ID = -1;
        let COL_IMG = -1;
        let COL_PROMPT = -1;
        let COL_STATUS = -1;
        let COL_VIDEO_URL = -1;

        // Parse header line properly
        const headerCols = parseCSVLine(lines[0], delimiter);

        // Word-boundary check: 'id' must be a standalone token (space-delimited).
        //   matches  → "id", "cell id"
        //   rejects  → "image2video", "video_id", "row_id", "higgsfield"
        function isIdColumn(str) {
            return /^id$/i.test(str) || /(?:^|\s)id(?:\s|$)/i.test(str);
        }

        headerCols.forEach((h, idx) => {
            const hLower = h.trim().toLowerCase().replace(/^\"|\"$/g, '');

            // First-match-wins so the correct early column sticks
            if (COL_ID === -1 && isIdColumn(hLower)) COL_ID = idx;
            if (COL_IMG === -1 && (hLower === 'img_url' || hLower === 'image url' || (hLower.includes('img') && hLower.includes('url')))) COL_IMG = idx;
            if (COL_PROMPT === -1 && hLower.includes('prompt')) COL_PROMPT = idx;
            if (COL_STATUS === -1 && hLower === 'status') COL_STATUS = idx;
            if (COL_VIDEO_URL === -1 && (hLower === 'video_url' || hLower === 'video url' || (hLower.includes('video') && hLower.includes('url')))) COL_VIDEO_URL = idx;
        });

        // Fallback to default positions if not found
        if (COL_ID === -1) COL_ID = 0;
        if (COL_IMG === -1) COL_IMG = 2;
        if (COL_PROMPT === -1) COL_PROMPT = 4;
        if (COL_STATUS === -1) COL_STATUS = 3;
        if (COL_VIDEO_URL === -1) COL_VIDEO_URL = 9; // Default position based on CSV format

        logInfo('CSV column detection', {
            ID: COL_ID,
            Image: COL_IMG,
            Prompt: COL_PROMPT,
            Status: COL_STATUS,
            VideoURL: COL_VIDEO_URL,
            headers: headerCols
        });

        // Get local video IDs if available
        const localVideoIds = getLocalVideoIds();

        // Helper function to check if a line is a header (compares against known header columns)
        function isHeaderLine(line, delimiter) {
            const cols = parseCSVLine(line, delimiter);
            // Check if this line matches header pattern (contains header keywords)
            const lineLower = line.toLowerCase();
            const hasHeaderKeywords = (
                (lineLower.includes('id') && (lineLower.includes('prompt') || lineLower.includes('image'))) ||
                (lineLower.includes('prompt') && lineLower.includes('url'))
            );

            // Also check if column count matches and values look like headers (not data)
            if (hasHeaderKeywords && cols.length >= 3) {
                // Check if first few columns look like headers (text, not IDs/URLs)
                const firstCol = (cols[COL_ID] || '').trim().toLowerCase();
                const secondCol = cols.length > COL_IMG ? (cols[COL_IMG] || '').trim().toLowerCase() : '';
                // Headers typically don't contain URLs or numeric IDs
                const looksLikeHeader = (
                    !firstCol.match(/^https?:\/\//) && // Not a URL
                    !firstCol.match(/^\d+$/) && // Not a pure number
                    (firstCol === 'id' || firstCol.includes('id'))
                );
                return looksLikeHeader;
            }
            return false;
        }

        // Log raw items count for debugging
        const rawDataLines = lines.slice(1).filter(line => line.trim());
        logInfo(`CSV parsing: ${rawDataLines.length} raw data lines (excluding header)`);

        // Process data lines
        let processedCount = 0;
        let skippedHeaderCount = 0;
        for (let idx = 1; idx < lines.length; idx++) {
            const line = lines[idx];
            if (!line.trim()) continue;

            // Explicit header detection: check if this line matches header pattern
            // Only skip if it's actually a header (not just because idx === 1)
            if (isHeaderLine(line, delimiter)) {
                skippedHeaderCount++;
                logInfo(`Skipping duplicate header at line ${idx + 1}: ${line.substring(0, 50)}...`);
                continue;
            }

            // Parse line with proper CSV handling
            const cols = parseCSVLine(line, delimiter);

            if (cols.length < Math.max(COL_ID, COL_IMG, COL_PROMPT) + 1) {
                console.warn(`Skipping line ${idx + 1}: insufficient columns`);
                continue;
            }

            const id = (cols[COL_ID] || '').trim().replace(/^"|"$/g, '');
            const prompt = (cols[COL_PROMPT] || '').trim().replace(/^"|"$/g, '');
            let imgUrl = (cols[COL_IMG] || '').trim().replace(/^"|"$/g, '');
            const status = COL_STATUS >= 0 && cols[COL_STATUS] ? (cols[COL_STATUS] || '').trim().replace(/^"|"$/g, '') : '';
            const videoUrl = COL_VIDEO_URL >= 0 && cols[COL_VIDEO_URL] ? (cols[COL_VIDEO_URL] || '').trim().replace(/^"|"$/g, '') : '';

            // Validate data
            if (!id || !prompt) {
                console.warn(`Skipping line ${idx + 1}: missing ID or Prompt`);
                continue;
            }

            // Validate image URL - if it doesn't look like a URL, clear it
            if (imgUrl && !isValidUrl(imgUrl)) {
                console.warn(`Invalid image URL for ID ${id}, clearing: ${imgUrl.substring(0, 50)}...`);
                imgUrl = '';
            }

            // Check status filtering - skip Generated, Scheduled, Published
            if (status && ['Generated', 'Scheduled', 'Published'].includes(status)) {
                skippedByStatus.push(id);
                continue;
            }

            // Check if already in queue
            const existing = STATE.queue.find(q => q.id === id);
            if (existing) {
                if (existing.status === 'Success' || existing.status === 'Downloaded') {
                    alreadyGenerated.push(id);
                } else {
                    duplicates.push(id);
                    // Update existing if not completed
                    existing.prompt = prompt;
                    existing.imgUrl = imgUrl;
                }
                continue;
            }

            // Check against local videos
            if (localVideoIds.has(id)) {
                alreadyGenerated.push(id);
                // Add to queue but mark as already generated
                parsed.push({
                    id: id,
                    prompt: prompt,
                    imgUrl: imgUrl,
                    status: 'Already Generated',
                    cellId: null,
                    filename: null,
                    index: idx, // Store CSV row index (1-based, since idx starts at 1 after header)
                    timestamp: Date.now()
                });
                continue;
            }

            // If video_url is present, mark as "Has Video" (not Success, so it doesn't block generation)
            // User can bulk download these separately
            if (videoUrl && isValidUrl(videoUrl)) {
                parsed.push({
                    id: id,
                    prompt: prompt,
                    imgUrl: imgUrl,
                    status: 'Has Video',  // Changed from 'Success' to allow generation if needed
                    videoUrl: videoUrl,
                    cellId: null,
                    filename: null,
                    index: idx, // Store CSV row index (1-based, since idx starts at 1 after header)
                    timestamp: Date.now()
                });
                continue;
            }

            // Add new item with index (row number from CSV, 1-based)
            parsed.push({
                id: id,
                prompt: prompt,
                imgUrl: imgUrl,
                status: 'Pending',
                cellId: null,
                filename: null,
                index: idx, // Store CSV row index (1-based, since idx starts at 1 after header)
                timestamp: Date.now()
            });
            processedCount++;
        }

        // Log parsing results for debugging
        logInfo(`CSV parsing complete: ${processedCount} lines processed, ${skippedHeaderCount} header(s) skipped, ${parsed.length} items parsed`);

        // Safety check: warn about duplicates and already-generated items
        if (duplicates.length > 0 || alreadyGenerated.length > 0 || skippedByStatus.length > 0) {
            let message = '';
            if (skippedByStatus.length > 0) {
                message += `Skipped ${skippedByStatus.length} items with status "Generated/Scheduled/Published".\n`;
            }
            if (alreadyGenerated.length > 0) {
                message += `Found ${alreadyGenerated.length} items that are already generated (local files or completed).\n`;
            }
            if (duplicates.length > 0) {
                message += `Found ${duplicates.length} duplicate IDs in queue (updated existing entries).\n`;
            }
            message += `\nProceed with importing ${parsed.length} new items?`;

            if (!confirm(message)) {
                toastManager.info('Import cancelled');
                return;
            }
        }

        if (parsed.length > 0) {
            STATE.queue.push(...parsed);
            HFStorage.saveQueue(STATE.queue);
            parsed.forEach(logRow);
            updateButtonStates();
            const hasVideoCount = parsed.filter(p => p.status === 'Has Video').length;
            const pendingCount = parsed.filter(p => p.status === 'Pending').length;
            logSuccess(`CSV import completed: ${parsed.length} items imported (${pendingCount} pending, ${hasVideoCount} with video URLs)`);
            toastManager.success(`Imported ${parsed.length} items (${pendingCount} pending, ${hasVideoCount} with videos)`);
            // Update dashboard if open
            if (window.updateDashboardTable) {
                window.updateDashboardTable();
            }
        } else if (duplicates.length > 0) {
            HFStorage.saveQueue(STATE.queue);
            updateButtonStates();
            logInfo(`CSV import: Updated ${duplicates.length} existing items`);
            toastManager.info(`Updated ${duplicates.length} existing items`);
            if (window.updateDashboardTable) {
                window.updateDashboardTable();
            }
        } else {
            updateButtonStates();
            logWarning('CSV import: No new items to import');
            toastManager.warning('No new items to import');
        }
    }

    /**************************************************************
     *   LOCAL VIDEO MATCHING SYSTEM
     **************************************************************/
    let localVideoIdsSet = new Set();

    function getLocalVideoIds() {
        return localVideoIdsSet;
    }

    function matchLocalVideos(fileList) {
        logInfo(`Matching local videos: ${fileList.length} files selected`);

        const matchedIds = new Set();
        const idPattern = /(\d+)/; // Extract numeric ID from filename
        const processedFiles = [];

        Array.from(fileList).forEach(file => {
            const match = file.name.match(idPattern);
            if (match) {
                const id = match[1];
                matchedIds.add(id);
                localVideoIdsSet.add(id);
                processedFiles.push({ filename: file.name, id: id });
            }
        });

        logInfo(`Extracted ${matchedIds.size} IDs from filenames`, { files: processedFiles });

        // Update queue items that match
        let updatedCount = 0;
        STATE.queue.forEach(item => {
            if (matchedIds.has(item.id) && item.status === 'Pending') {
                item.status = 'Already Generated';
                logRow(item);
                updatedCount++;
            }
        });

        HFStorage.saveQueue(STATE.queue);

        if (matchedIds.size > 0) {
            logSuccess(`Matched ${matchedIds.size} local videos, updated ${updatedCount} queue items`);
            toastManager.success(`Matched ${matchedIds.size} local videos (${updatedCount} items updated)`);
        } else {
            logWarning('No matching videos found - no IDs extracted from filenames');
            toastManager.warning('No matching videos found');
        }

        return matchedIds;
    }

    function handleLocalVideoUpload(event) {
        const files = event.target.files;
        if (!files || files.length === 0) {
            logWarning('No files selected for video matching');
            return;
        }

        logInfo(`Video matching started: ${files.length} files`);
        matchLocalVideos(files);
        event.target.value = ''; // Reset input
    }

    function exportData() {
        console.log('[exportData] Function called');
        console.log('[exportData] Queue length:', STATE.queue.length);
        if (STATE.queue.length === 0) {
            console.warn('[exportData] No data to export');
            toastManager.warning('No data to export');
            return;
        }

        // Create CSV with additional columns including timestamp
        const headers = ['ID', 'Image URL', 'Prompt', 'Status', 'Timestamp', 'Cell ID', 'Video URL', 'Filename'];
        const rows = STATE.queue.map(item => [
            item.id,
            item.imgUrl || '',
            `"${item.prompt}"`,
            item.status,
            item.timestamp ? new Date(item.timestamp).toISOString() : '',
            item.cellId || '',
            item.videoUrl || '',
            item.filename || ''
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `higgsfield-export-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        toastManager.success('Data exported to CSV');
    }

    function exportDataJSON() {
        console.log('[exportDataJSON] Function called');
        console.log('[exportDataJSON] Queue length:', STATE.queue.length);
        if (STATE.queue.length === 0) {
            console.warn('[exportDataJSON] No data to export');
            toastManager.warning('No data to export');
            return;
        }

        const data = {
            exportDate: new Date().toISOString(),
            version: '4.0',
            queue: STATE.queue,
            history: HFStorage.getHistory(),
            mapping: HFStorage.getMapping()
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `higgsfield-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        toastManager.success('Data exported to JSON');
    }

    // --- LOGGING ---
    function logRow(item) {
        // Save to storage whenever status changes
        HFStorage.saveQueue(STATE.queue);

        // If status is Success or Error, add to history
        if (item.status === 'Success' || item.status === 'Error' || item.status === 'Download Error') {
            HFStorage.addToHistory(item);
        }

        // Update both main panel table and dashboard table
        const tbody = document.querySelector('#hf-log-table tbody');
        if (tbody) {
            let row = document.getElementById(`log-row-${item.id}`);
            if (!row) {
                row = document.createElement('tr');
                row.id = `log-row-${item.id}`;
                tbody.appendChild(row);
            }

            // Clear existing content
            row.innerHTML = '';

            // ID cell
            const idCell = createElement('td', {
                'data-value': item.id,
                class: 'id-cell'
            });
            idCell.textContent = item.id;
            row.appendChild(idCell);

            // Prompt cell (truncated like dashboard)
            const promptCell = createElement('td', {
                'data-value': item.prompt,
                class: 'prompt-cell',
                title: item.prompt
            });
            const promptText = item.prompt && item.prompt.length > 80 ? item.prompt.substring(0, 80) + '...' : (item.prompt || '-');
            promptCell.textContent = promptText;
            row.appendChild(promptCell);

            // Status cell with badge formatting (matching dashboard)
            const statusCell = createElement('td');
            const statusBadge = createElement('span', {
                class: `hf-status-badge status-${item.status.toLowerCase().split(' ')[0]}`
            });
            statusBadge.textContent = item.status;
            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);

            // Timestamp cell
            const timestampCell = createElement('td', {
                'data-value': item.timestamp || '',
                class: 'timestamp-cell'
            });
            if (item.timestamp) {
                const date = new Date(item.timestamp);
                timestampCell.textContent = date.toLocaleString();
                timestampCell.title = date.toISOString();
            } else {
                timestampCell.textContent = '-';
            }
            row.appendChild(timestampCell);

            row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Update dashboard table if it exists
        if (window.updateDashboardTable) {
            window.updateDashboardTable();
        }

        // Update button states after status change
        updateButtonStates();
    }

    function updateStatus(msg) {
        const statusEl = document.getElementById('hf-status-text');
        if (statusEl) statusEl.innerText = msg;
        const total = STATE.queue.length;
        const current = STATE.queue.filter(i => i.status !== 'Pending').length;
        const counterEl = document.getElementById('hf-counter');
        if (counterEl) counterEl.innerText = `${current}/${total}`;
    }

    // --- PARSING ---
    function parseCSV() {
        const raw = document.getElementById('hf-input')?.value.trim();
        if (!raw) return [];

        // Use the shared parseAndImportCSV function
        const lines = raw.split('\n').filter(line => line.trim());
        const parsed = [];

        const COL_ID = 0;
        const COL_IMG = 2;
        const COL_PROMPT = 4;

        lines.forEach((line, idx) => {
            if (idx === 0 && line.toLowerCase().includes('prompt')) return;
            if (!line.trim()) return;

            const cols = line.includes('\t') ? line.split('\t') : line.split(',');

            const id = (cols[COL_ID] || '').trim();
            const prompt = (cols[COL_PROMPT] || '').replace(/^"|"$/g, '').trim();
            let imgUrl = (cols[COL_IMG] || '').replace(/^"|"$/g, '').trim();

            if (id && prompt) {
                parsed.push({
                    id: id,
                    prompt: prompt,
                    imgUrl: imgUrl,
                    status: 'Pending',
                    cellId: null,
                    filename: null,
                    timestamp: Date.now()
                });
            }
        });
        return parsed;
    }

    // --- CORE AUTOMATION LOGIC ---

    async function startQueue() {
        console.log('[startQueue] Function called');
        console.log('[startQueue] Current state - isProcessing:', STATE.isProcessing, 'isPaused:', STATE.isPaused, 'queue length:', STATE.queue.length);
        if (STATE.isProcessing) {
            console.warn('[startQueue] Queue already processing, aborting');
            logWarning('Queue already processing');
            return;
        }

        const newItems = parseCSV();
        if (newItems.length === 0 && STATE.queue.length === 0) {
            logWarning('No data found! Please paste CSV data or import a file.');
            toastManager.warning('No data found! Please paste CSV data or import a file.');
            return;
        }

        if (newItems.length > 0) {
            logInfo(`Starting queue with ${newItems.length} new items`);
            // Merge new items with existing queue (avoid duplicates)
            newItems.forEach(newItem => {
                const existing = STATE.queue.find(q => q.id === newItem.id);
                if (!existing) {
                    STATE.queue.push(newItem);
                }
            });
            HFStorage.saveQueue(STATE.queue);
            STATE.queue.forEach(logRow);
        } else {
            logInfo(`Starting queue with ${STATE.queue.length} existing items`);
        }

        STATE.isProcessing = true;
        STATE.isPaused = false;
        updateButtonStates();

        logInfo('Queue started');
        // Start the generation observer
        generationObserver.start();

        processNextItem();
    }

    function togglePause() {
        console.log('[togglePause] Function called');
        console.log('[togglePause] Current state - isProcessing:', STATE.isProcessing, 'isPaused:', STATE.isPaused);
        STATE.isPaused = !STATE.isPaused;
        console.log('[togglePause] New isPaused state:', STATE.isPaused);
        if (STATE.isPaused) {
            console.log('[togglePause] Queue paused');
            logInfo('Queue paused');
            updateStatus("Paused");
        } else {
            console.log('[togglePause] Queue resumed');
            logInfo('Queue resumed');
            updateStatus("Resuming...");
            // Resume processing
            if (STATE.isProcessing) {
                console.log('[togglePause] Resuming processing, calling processNextItem()');
                processNextItem();
            }
        }
        updateButtonStates();
    }

    function stopQueue() {
        console.log('[stopQueue] Function called');
        console.log('[stopQueue] Current state - isProcessing:', STATE.isProcessing, 'isPaused:', STATE.isPaused);
        logInfo('Queue stopped');
        STATE.isProcessing = false;
        STATE.isPaused = false;
        console.log('[stopQueue] State updated - isProcessing:', STATE.isProcessing, 'isPaused:', STATE.isPaused);
        generationObserver.stop();
        console.log('[stopQueue] Generation observer stopped');
        HFStorage.saveQueue(STATE.queue);
        console.log('[stopQueue] Queue saved to storage');
        updateStatus("Stopped");
        updateButtonStates();
        toastManager.info('Queue stopped. Progress saved.');
    }

    /**************************************************************
     *   GENERATION OBSERVER - Decoupled tracking system
     **************************************************************/
    // Helper functions for layout-agnostic detection
    /**
     * Find the grid/list container regardless of layout type
     * Works with both grid (data-asset-grid-scroll="true") and list layouts
     */
    function findGridContainer() {
        // Try grid layout first (has data-asset-grid-scroll attribute)
        let container = document.querySelector('div[data-asset-grid-scroll="true"]');
        if (container) return container;

        container = document.querySelector('[data-asset-grid-scroll]');
        if (container) return container;

        // Try list layout (has overflow-y-auto, classes vary with zoom)
        // Look for containers with overflow-y-auto that contain video/media elements
        const candidates = document.querySelectorAll('div[class*="overflow-y-auto"], div[class*="overflow"]');
        for (const candidate of candidates) {
            // Check if it contains media elements (figures, videos, images with data attributes)
            const hasMedia = candidate.querySelector('figure[data-cell-id], [data-cell-id], [data-index], video, img[alt*="media asset"]');
            if (hasMedia) {
                return candidate;
            }
        }

        // Fallback: try main element or any container with figures
        container = document.querySelector('main');
        if (container && container.querySelector('figure, [data-cell-id], [data-index]')) {
            return container;
        }

        return null;
    }

    /**
     * Extract cell ID from an element, works with both grid and list layouts
     * Grid: uses data-cell-id on figure elements
     * List: uses data-index on container elements, may have nested figures
     */
    function extractCellId(element) {
        if (!element) return null;

        // Method 1: data-cell-id attribute (grid layout)
        let id = element.getAttribute('data-cell-id');
        if (id) return id;

        // Method 2: data-index attribute (list layout)
        id = element.getAttribute('data-index');
        if (id) return id;

        // Method 3: Find nested figure with data-cell-id (list layout with nested structure)
        const figure = element.querySelector('figure[data-cell-id]');
        if (figure) {
            id = figure.getAttribute('data-cell-id');
            if (id) return id;
        }

        // Method 4: Find any child with data-cell-id
        const childWithId = element.querySelector('[data-cell-id]');
        if (childWithId) {
            id = childWithId.getAttribute('data-cell-id');
            if (id) return id;
        }

        // Method 5: Find any child with data-index
        const childWithIndex = element.querySelector('[data-index]');
        if (childWithIndex) {
            id = childWithIndex.getAttribute('data-index');
            if (id) return id;
        }

        return null;
    }

    /**
     * Get all cell elements from the container, works with both layouts
     */
    function getAllCellElements(container) {
        if (!container) return [];

        const cells = [];

        // Grid layout: direct figure elements with data-cell-id
        let figures = container.querySelectorAll('figure[data-cell-id]');
        if (figures.length > 0) {
            figures.forEach(fig => cells.push(fig));
        }

        // Grid layout fallback: any element with data-cell-id
        if (cells.length === 0) {
            figures = container.querySelectorAll('[data-cell-id]');
            figures.forEach(fig => cells.push(fig));
        }

        // List layout: containers with data-index (may contain nested figures)
        if (cells.length === 0) {
            const listContainers = container.querySelectorAll('[data-index]');
            listContainers.forEach(container => {
                // Check if it has a nested figure
                const nestedFigure = container.querySelector('figure');
                if (nestedFigure) {
                    cells.push(nestedFigure); // Use the figure if available
                } else {
                    cells.push(container); // Use the container itself
                }
            });
        }

        // List layout fallback: try finding by class pattern (classes vary with zoom)
        if (cells.length === 0) {
            // Look for elements that match list layout pattern
            const listItems = container.querySelectorAll('div[class*="w-full"][class*="pl-"], div[class*="w-full"][class*="pt-"]');
            listItems.forEach(item => {
                if (item.getAttribute('data-index') || item.querySelector('figure, video, img[alt*="media"]')) {
                    const nestedFigure = item.querySelector('figure');
                    cells.push(nestedFigure || item);
                }
            });
        }

        return cells;
    }

    class GenerationObserver {
        constructor() {
            this.observer = null;
            this.checkInterval = null;
            this.isRunning = false;
            this.mappings = STATE.generationMap;
            this.checkCount = 0;
        }

        start() {
            if (this.isRunning) return;
            this.isRunning = true;

            const container = findGridContainer();
            if (!container) {
                setTimeout(() => this.start(), 1000);
                return;
            }

            // MutationObserver for new elements
            this.observer = new MutationObserver(() => {
                this.checkForCompletedVideos();
            });

            this.observer.observe(container, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src', 'data-cell-id', 'data-index', 'class', 'data-status'] // Added data-index, class, data-status for list layout
            });

            // Also check periodically for robustness
            this.checkInterval = setInterval(() => {
                this.checkForCompletedVideos();
            }, 2000);

            this.checkForCompletedVideos(); // Initial check
            console.log("GenerationObserver started");
        }

        stop() {
            this.isRunning = false;
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = null;
            }
        }

        checkForCompletedVideos() {
            // Use helper function to find container (works for both grid and list layouts)
            const container = findGridContainer();
            if (!container) return;

            // Use helper function to get all cell elements (works for both layouts)
            const cellElements = getAllCellElements(container);

            const processingCount = STATE.queue.filter(i => i.status === 'Generating' || i.status.includes('Gen')).length;

            if (this.mappings && this.mappings.size > 0) {
                // Log periodically (every 10 checks = ~20 seconds)
                if (!this.checkCount) this.checkCount = 0;
                this.checkCount++;
                if (this.checkCount % 10 === 0) {
                    logInfo(`Checking for completed videos. Container: ${container ? 'found' : 'not found'}, Cells: ${cellElements.length}, Mapped: ${this.mappings.size}, Processing: ${processingCount}`);
                }
            }

            // Track all cells with their IDs for mapping
            const cellIdMap = new Map();
            cellElements.forEach(fig => {
                const cellId = extractCellId(fig);
                if (cellId) {
                    cellIdMap.set(cellId, fig);
                }
            });

            // First, check all mapped items to see if their cells are still in the DOM
            const mapping = HFStorage.getMapping();
            Object.keys(mapping).forEach(cellId => {
                const mappingData = mapping[cellId];
                const item = STATE.queue.find(q => q.id === mappingData.queueId);
                if (!item) {
                    // Clean up orphaned mapping
                    HFStorage.removeMapping(cellId);
                    STATE.generationMap.delete(cellId);
                    return;
                }

                const fig = cellIdMap.get(cellId);
                if (!fig) {
                    // Cell not found in DOM - might have been removed or not rendered yet
                    return;
                }

                // Enhanced generation state detection
                const cellText = fig.textContent || '';
                const cellTextLower = cellText.toLowerCase();

                // Check for "In progress" text (case-insensitive, handles variations)
                const hasInProgressText = (
                    cellTextLower.includes('in progress') ||
                    cellTextLower.includes('generating') ||
                    cellTextLower.includes('processing') ||
                    cellTextLower.includes('creating')
                );

                // Check for loading spinners (enhanced selectors)
                const hasLoadingSpinner = fig.querySelector(
                    'svg.animate-spin, ' +
                    '[class*="spinner"], ' +
                    '[class*="loading"], ' +
                    '[class*="progress"], ' +
                    '[data-status="loading"], ' +
                    '[aria-label*="loading" i], ' +
                    'svg[class*="animate"], ' +
                    'div[class*="spinner"]'
                );

                // Check for error indicators (enhanced)
                const hasErrorIndicator = fig.querySelector(
                    '[class*="error"], ' +
                    '[data-error], ' +
                    '[data-status="error"], ' +
                    '[aria-label*="error" i], ' +
                    '[class*="failed"], ' +
                    'svg[class*="error"]'
                );

                // Check for play button or completion indicators
                const hasPlayButton = fig.querySelector(
                    'button[class*="play"], ' +
                    '[class*="play-button"], ' +
                    'svg[viewBox*="12"] path[fill="currentColor"], ' +
                    'button[aria-label*="play" i]'
                );

                // Check if video is ready - try multiple selectors (works in both layouts)
                let video = fig.querySelector('video');
                if (!video) {
                    // Try finding video in parent or siblings (list layout may have nested structure)
                    const parent = fig.parentElement;
                    if (parent) {
                        video = parent.querySelector('video');
                        // Also check parent's parent for list layout
                        if (!video && parent.parentElement) {
                            video = parent.parentElement.querySelector('video');
                        }
                    }
                }

                // Check for video source in various formats
                const hasVideoSource = video && video.src && (
                    video.src.includes('.mp4') ||
                    video.src.includes('video') ||
                    video.src.startsWith('blob:') ||
                    video.src.includes('higgsfield') ||
                    video.src.includes('cloudfront') ||
                    video.src.includes('amazonaws') ||
                    video.src.includes('.m3u8') ||
                    video.querySelector('source[src*=".mp4"]')
                );

                // Enhanced status detection and tracking
                if (hasErrorIndicator) {
                    // Generation failed
                    if (item.status === 'Generating' || item.status.includes('Gen')) {
                        item.status = 'Error';
                        item.errorMessage = 'Generation failed (error indicator detected)';
                        logError(`Generation failed for item ${item.id}`, { cellId, cellText: cellText.substring(0, 100) });
                        logRow(item);
                        HFStorage.saveQueue(STATE.queue);
                    }
                } else if (hasVideoSource) {
                    // Video is ready!
                    if (item.status !== 'Success' && item.status !== 'Download Error' && item.status !== 'Ready') {
                        logSuccess(`Video completed for item ${item.id}`, { cellId, videoUrl: video.src });
                        // Update video URL immediately
                        item.videoUrl = video.src;
                        // Update status and trigger download
                        downloadVideo(video.src, item, cellId);
                        // logRow is called inside downloadVideo, but ensure it's updated
                        HFStorage.saveQueue(STATE.queue);
                    }
                } else if (!hasVideoSource && item.status === 'Generating') {
                    // Video not found yet - try extracting via hover simulation
                    // This handles cases where video hasn't been injected yet
                    logInfo(`checkForCompletedVideos: Video not found in DOM for item ${item.id}, attempting hover extraction`, {
                        itemId: item.id,
                        cellId: cellId,
                        hasSpinner: !!hasLoadingSpinner,
                        hasInProgressText: hasInProgressText
                    });
                    extractVideoFromCell(fig).then(videoUrl => {
                        if (videoUrl && item.status === 'Generating') {
                            logSuccess(`checkForCompletedVideos: Video URL extracted via hover for item ${item.id}`, {
                                itemId: item.id,
                                cellId: cellId,
                                videoUrl: videoUrl.substring(0, 80),
                                extractionMethod: 'hover_simulation'
                            });
                            item.videoUrl = videoUrl;
                            downloadVideo(videoUrl, item, cellId);
                            HFStorage.saveQueue(STATE.queue);
                        } else {
                            logInfo(`checkForCompletedVideos: Hover extraction returned no video URL for item ${item.id}`, {
                                itemId: item.id,
                                cellId: cellId,
                                itemStatus: item.status
                            });
                        }
                    }).catch(err => {
                        logError(`checkForCompletedVideos: Failed to extract video from cell ${cellId}`, {
                            cellId: cellId,
                            itemId: item.id,
                            error: err.message,
                            errorStack: err.stack
                        });
                    });
                } else if ((hasLoadingSpinner || hasInProgressText) && (item.status === 'Generating' || item.status.includes('Gen'))) {
                    // Still generating - confirm it's active
                    if (this.checkCount % 15 === 0) {
                        logInfo(`Item ${item.id} still generating (spinner: ${!!hasLoadingSpinner}, in-progress text: ${hasInProgressText})`, {
                            cellId,
                            hasSpinner: !!hasLoadingSpinner,
                            hasInProgressText: hasInProgressText
                        });
                    }
                    // Ensure status is set to Generating if it's not already
                    if (item.status !== 'Generating') {
                        item.status = 'Generating';
                        item.cellId = cellId;
                        logRow(item);
                        HFStorage.saveQueue(STATE.queue);
                    }
                } else if (hasPlayButton && item.status === 'Generating') {
                    // Play button suggests video might be ready but not loaded yet
                    // Check if video element exists but src is not set
                    if (video && !video.src) {
                        // Video element exists but no src - might be loading
                        if (this.checkCount % 10 === 0) {
                            logInfo(`Item ${item.id} video loading (play button detected)`, { cellId });
                        }
                    }
                }
            });

            // Also check for items in "Waiting Start..." or "Clicking Gen" that might have new cells
            // This helps catch items that were just started but don't have a cellId yet
            STATE.queue.forEach(item => {
                if ((item.status === 'Waiting Start...' || item.status === 'Clicking Gen') && !item.cellId) {
                    // Look for new cells that aren't mapped yet
                    cellElements.forEach(fig => {
                        const cellId = extractCellId(fig);
                        if (!cellId) return;

                        // Check if this cell is already mapped
                        if (mapping[cellId]) return;

                        // Check if this cell looks like it's generating (has spinner or in-progress text)
                        const cellText = fig.textContent || '';
                        const cellTextLower = cellText.toLowerCase();
                        const hasInProgressText = (
                            cellTextLower.includes('in progress') ||
                            cellTextLower.includes('generating') ||
                            cellTextLower.includes('processing')
                        );
                        const hasLoadingSpinner = fig.querySelector('svg.animate-spin, [class*="spinner"], [class*="loading"]');

                        // If cell looks like it's generating and we have an item waiting, map them
                        if ((hasInProgressText || hasLoadingSpinner) && !item.cellId) {
                            // This might be our item - map it
                            item.cellId = cellId;
                            item.status = 'Generating';
                            STATE.generationMap.set(cellId, item);
                            HFStorage.addMapping(cellId, item.id, 'processing');
                            logInfo(`Mapped item ${item.id} to new generation cell ${cellId}`, { cellId, itemId: item.id });
                            logRow(item);
                            HFStorage.saveQueue(STATE.queue);
                        }
                    });
                }
            });

            // Scan for already-generated videos that don't have video URLs yet
            // This handles cases where videos were generated before the script started tracking
            STATE.queue.forEach(item => {
                if ((item.status === 'Generating' || item.status === 'Ready') && item.cellId && !item.videoUrl) {
                    const fig = cellIdMap.get(item.cellId);
                    if (fig) {
                        logInfo(`checkForCompletedVideos: Scanning for video URL for already-generated item ${item.id}`, {
                            itemId: item.id,
                            cellId: item.cellId,
                            status: item.status
                        });
                        // Try to extract video URL via hover
                        extractVideoFromCell(fig).then(videoUrl => {
                            if (videoUrl && !item.videoUrl) {
                                logSuccess(`checkForCompletedVideos: Found video URL for already-generated item ${item.id}`, {
                                    itemId: item.id,
                                    cellId: item.cellId,
                                    videoUrl: videoUrl.substring(0, 80),
                                    extractionMethod: 'scan_existing'
                                });
                                item.videoUrl = videoUrl;
                                if (item.status === 'Generating') {
                                    logInfo(`checkForCompletedVideos: Triggering download for item ${item.id}`, { itemId: item.id, cellId: item.cellId });
                                    downloadVideo(videoUrl, item, item.cellId);
                                }
                                HFStorage.saveQueue(STATE.queue);
                            } else {
                                logInfo(`checkForCompletedVideos: No video URL found for item ${item.id} (might not be ready yet)`, {
                                    itemId: item.id,
                                    cellId: item.cellId,
                                    hasVideoUrl: !!videoUrl,
                                    itemStatus: item.status
                                });
                            }
                        }).catch(err => {
                            logWarning(`checkForCompletedVideos: Error extracting video for item ${item.id}`, {
                                itemId: item.id,
                                cellId: item.cellId,
                                error: err.message
                            });
                        });
                    } else {
                        logWarning(`checkForCompletedVideos: Cell element not found in DOM for item ${item.id}`, {
                            itemId: item.id,
                            cellId: item.cellId
                        });
                    }
                }
            });
        }
    }

    // Initialize observer
    const generationObserver = new GenerationObserver();

    /**
     * Switch to List layout mode for better prompt extraction
     * @returns {Promise<boolean>} True if successfully switched, false otherwise
     */
    async function switchToListLayout() {
        try {
            // Find the List button by aria-controls attribute containing "content-prompt"
            const listButton = document.querySelector('button[aria-controls*="content-prompt"], button[id*="trigger-prompt"]');

            if (!listButton) {
                logWarning('Pre-fetch: List layout button not found');
                return false;
            }

            // Check if already in list mode
            const isActive = listButton.getAttribute('aria-selected') === 'true' ||
                listButton.getAttribute('data-state') === 'active';

            if (isActive) {
                logInfo('Pre-fetch: Already in List layout mode');
                return true;
            }

            // Click the button to switch to list mode
            listButton.click();
            logInfo('Pre-fetch: Switched to List layout mode');

            // Wait for layout to switch
            await sleep(500);

            return true;
        } catch (error) {
            logError(`Pre-fetch: Error switching to list layout: ${error.message}`);
            return false;
        }
    }

    async function switchToGridLayout() {
        try {
            // Find the Grid button - it's the second button in the tablist (with aria-controls containing "content-default")
            // Or find by id containing "trigger-default"
            const gridButton = document.querySelector('button[aria-controls*="content-default"], button[id*="trigger-default"]');

            // Fallback: find the tablist and get the second button
            if (!gridButton) {
                const tablist = document.querySelector('div[role="tablist"][aria-orientation="horizontal"]');
                if (tablist) {
                    const buttons = tablist.querySelectorAll('button[role="tab"]');
                    if (buttons.length >= 2) {
                        // Second button is the Grid button
                        const secondButton = buttons[1];
                        if (secondButton && secondButton.textContent && secondButton.textContent.includes('Grid')) {
                            // Check if already in grid mode
                            const isActive = secondButton.getAttribute('aria-selected') === 'true' ||
                                secondButton.getAttribute('data-state') === 'active';

                            if (isActive) {
                                logInfo('Pre-fetch: Already in Grid layout mode');
                                return true;
                            }

                            secondButton.click();
                            logInfo('Pre-fetch: Switched to Grid layout mode');
                            await sleep(500);
                            return true;
                        }
                    }
                }
            }

            if (!gridButton) {
                logWarning('Pre-fetch: Grid layout button not found');
                return false;
            }

            // Check if already in grid mode
            const isActive = gridButton.getAttribute('aria-selected') === 'true' ||
                gridButton.getAttribute('data-state') === 'active';

            if (isActive) {
                logInfo('Pre-fetch: Already in Grid layout mode');
                return true;
            }

            // Click the button to switch to grid mode
            gridButton.click();
            logInfo('Pre-fetch: Switched to Grid layout mode');

            // Wait for layout to switch
            await sleep(500);

            return true;
        } catch (error) {
            logError(`Pre-fetch: Error switching to grid layout: ${error.message}`);
            return false;
        }
    }

    // Pre-fetch state management
    window.prefetchState = window.prefetchState || {
        isRunning: false,
        isPaused: false,
        isCancelled: false,
        currentProgress: 0,
        totalItems: 0
    };

    /**
     * Pre-fetch all generated videos from the DOM (PHASE 1: Collection Only)
     * Uses list layout to quickly collect items with prompts and thumbnails
     * Video URL extraction is deferred to modal actions (on-demand, using grid layout)
     *
     * @returns {Promise<Array>} Array of video objects with: {cellId, dataIndex, thumbnailUrl, videoUrl, prompt, status}
     */
    async function prefetchAllGeneratedVideos() {
        // Prevent multiple simultaneous runs
        if (window.prefetchState.isRunning) {
            logWarning('Pre-fetch already running');
            toastManager.warning('Pre-fetch is already running');
            return window.prefetchedVideosData || [];
        }

        // Initialize state
        window.prefetchState.isRunning = true;
        window.prefetchState.isPaused = false;
        window.prefetchState.isCancelled = false;
        window.prefetchState.currentProgress = 0;
        window.prefetchState.totalItems = 0;

        // Update button state
        const prefetchBtn = document.getElementById('hf-btn-prefetch');
        if (prefetchBtn) {
            prefetchBtn.disabled = true;
            prefetchBtn.classList.add('loading');
            const btnLabel = prefetchBtn.querySelector('.btn-label');
            if (btnLabel) btnLabel.textContent = 'Pre-Fetching...';
        }
        try {
            logInfo('Starting pre-fetch of all generated videos from DOM...');
            toastManager.info('Discovering generated videos...');

            const container = findGridContainer();
            if (!container) {
                logWarning('Pre-fetch: Grid container not found');
                toastManager.warning('Grid container not found. Please ensure you are on the create page.');
                return [];
            }

            // PHASE 1: Always use list layout for collection (better prompts)
            logInfo('Pre-fetch: Switching to list layout for collection...');
            const switched = await switchToListLayout();
            if (switched) {
                await sleep(1500); // Wait for layout to fully switch
            }

            // Re-check container after layout switch - find the actual container with list items
            const findListContainer = () => {
                // First, find all elements with data-index to locate the actual container
                const listItems = document.querySelectorAll('[data-index]');
                if (listItems.length === 0) {
                    logWarning('Pre-fetch: No [data-index] elements found in list layout');
                    return null;
                }

                // Find the common parent container that contains most list items
                // Start from the first item and walk up to find a container
                const firstItem = listItems[0];
                let candidate = firstItem.parentElement;
                let bestContainer = null;
                let maxItems = 0;

                // Check up to 5 levels up
                for (let i = 0; i < 5 && candidate; i++) {
                    const itemsInCandidate = candidate.querySelectorAll('[data-index]').length;
                    if (itemsInCandidate > maxItems) {
                        maxItems = itemsInCandidate;
                        bestContainer = candidate;
                    }
                    candidate = candidate.parentElement;
                }

                // If we found a good container, use it; otherwise use document.body
                if (bestContainer && maxItems >= listItems.length * 0.5) {
                    logInfo(`Pre-fetch: Found list container with ${maxItems} items`);
                    return bestContainer;
                }

                // Fallback: use the container from findGridContainer or document.body
                const updatedContainer = findGridContainer();
                return updatedContainer || document.body;
            };

            const finalContainer = findListContainer();
            if (!finalContainer) {
                logWarning('Pre-fetch: Could not find list container');
                toastManager.warning('Could not find list container. Please ensure you are on the create page.');
                return [];
            }

            logInfo(`Pre-fetch: Using container for list layout collection`);

            // PHASE 1: Scroll and collect all visible items in LIST LAYOUT (for prompts)
            const collectedItems = new Map(); // Map<identifier, {prompt, thumbnailUrl, cellId, dataIndex}>
            const SCROLL_STEP = 600;
            const WAIT_MS = 800;
            const MAX_SAFETY_COUNT = 3;
            const MAX_SCROLL_ATTEMPTS = 200;

            let lastSize = 0;
            let safety = 0;
            let scrollAttempts = 0;

            // Determine scrollable element
            const getScrollableElement = () => {
                const computedStyle = window.getComputedStyle(finalContainer);
                const hasOverflow = computedStyle.overflowY === 'auto' || computedStyle.overflowY === 'scroll' ||
                    computedStyle.overflow === 'auto' || computedStyle.overflow === 'scroll';

                if (hasOverflow && finalContainer.scrollHeight > finalContainer.clientHeight) {
                    return { element: finalContainer, isContainer: true };
                }
                return { element: window, isContainer: false };
            };

            const scrollable = getScrollableElement();
            logInfo(`Pre-fetch: Using ${scrollable.isContainer ? 'container' : 'window'} scrolling`);

            // Function to scrape visible items in LIST LAYOUT ONLY
            // Query document broadly using stable patterns (data-index, data-cell-id, etc.)
            let scrapeCallCount = 0;
            const scrapeVisible = () => {
                scrapeCallCount++;
                // Query document broadly for list layout items using stable pattern [data-index]
                // Don't rely on container since it might not be correctly identified
                const listRows = document.querySelectorAll('[data-index]');

                // Log only on first call and every 10th call to avoid spam
                if (scrapeCallCount === 1 || scrapeCallCount % 10 === 0) {
                    logInfo(`Pre-fetch: Scrape #${scrapeCallCount} - Found ${listRows.length} [data-index] elements in document`);
                }

                let newItemsCount = 0;
                listRows.forEach(row => {
                    const dataIndex = row.getAttribute('data-index');
                    if (!dataIndex || collectedItems.has(dataIndex)) return;

                    // Check for cancellation
                    if (window.prefetchState.isCancelled) return;

                    // Extract prompt from span[data-lexical-text="true"] (stable pattern)
                    const promptEl = row.querySelector('span[data-lexical-text="true"]');
                    let prompt = '';
                    if (promptEl) {
                        prompt = promptEl.innerText?.trim() || promptEl.textContent?.trim() || '';
                        // Filter out video error messages
                        if (prompt.toLowerCase().includes('your browser does not support') ||
                            prompt.toLowerCase().includes('video tag')) {
                            prompt = '';
                        }
                    }

                    // Extract thumbnail URL using stable pattern img[src*="cloudfront"]
                    const imgEl = row.querySelector('img[src*="cloudfront"]');
                    let thumbnailUrl = null;
                    if (imgEl && imgEl.src && !imgEl.src.includes('data:image')) {
                        thumbnailUrl = imgEl.src;
                    }

                    // Extract cellId from nested figure if available (stable pattern figure[data-cell-id])
                    const nestedFigure = row.querySelector('figure[data-cell-id]');
                    let cellId = nestedFigure ? nestedFigure.getAttribute('data-cell-id') : null;

                    // Also try to find cellId from any child with data-cell-id (stable pattern)
                    if (!cellId) {
                        const cellIdEl = row.querySelector('[data-cell-id]');
                        if (cellIdEl) {
                            cellId = cellIdEl.getAttribute('data-cell-id');
                        }
                    }

                    // Try to extract cellId from thumbnail URL if it contains the pattern
                    // Pattern: https://d2ol7oe51mr4n9.cloudfront.net/[user_id_hash]/[uuid].jpg
                    // Video pattern would be: https://[video_cdn].cloudfront.net/[user_id_hash]/hf_YYYYMMDD_HHMMSS_<data-cell-id>.mp4
                    // But we can't extract cellId from image URL directly, so we'll rely on DOM

                    // Additional fallback: search in the entire row subtree more thoroughly
                    if (!cellId) {
                        // Try querySelectorAll to find all elements with data-cell-id in the row
                        const allCellIdElements = row.querySelectorAll('[data-cell-id]');
                        if (allCellIdElements.length > 0) {
                            // Prefer figure elements, but take any if available
                            for (const el of allCellIdElements) {
                                if (el.tagName.toLowerCase() === 'figure') {
                                    cellId = el.getAttribute('data-cell-id');
                                    break;
                                }
                            }
                            // If no figure found, take the first one
                            if (!cellId && allCellIdElements.length > 0) {
                                cellId = allCellIdElements[0].getAttribute('data-cell-id');
                            }
                        }
                    }

                    // Collect ANY item with data-index (data-index is a stable identifier)
                    // Even if we don't have prompt/thumbnail/cellId yet, we can collect it
                    // and try to extract more info later or during video URL extraction
                    collectedItems.set(dataIndex, {
                        prompt: prompt || '',
                        thumbnailUrl: thumbnailUrl || null,
                        cellId: cellId || null,
                        dataIndex: dataIndex
                    });
                    newItemsCount++;

                    // Log diagnostic info for first few items to debug cellId extraction
                    if (newItemsCount <= 3 && !cellId) {
                        logInfo(`Pre-fetch: Item ${dataIndex} - cellId not found. Has prompt: ${!!prompt}, Has thumbnail: ${!!thumbnailUrl}, Row tag: ${row.tagName}, Row classes: ${row.className.substring(0, 50)}`);
                    }
                });

                // Log new items found (only on first call and periodically)
                if ((scrapeCallCount === 1 || scrapeCallCount % 10 === 0) && newItemsCount > 0) {
                    logInfo(`Pre-fetch: Added ${newItemsCount} new items in scrape #${scrapeCallCount}. Total: ${collectedItems.size}`);
                }
            };

            // Initial scrape
            scrapeVisible();
            logInfo(`Pre-fetch: Initial scrape found ${collectedItems.size} items`);

            // Diagnostic: If no items found, check what's in the DOM
            if (collectedItems.size === 0) {
                const allDataIndex = document.querySelectorAll('[data-index]');
                const allDataCellId = document.querySelectorAll('[data-cell-id]');
                const allCloudfrontImgs = document.querySelectorAll('img[src*="cloudfront"]');
                const allLexicalText = document.querySelectorAll('span[data-lexical-text="true"]');

                logWarning(`Pre-fetch: No items found in initial scrape. Diagnostics:`, {
                    dataIndexElements: allDataIndex.length,
                    dataCellIdElements: allDataCellId.length,
                    cloudfrontImages: allCloudfrontImgs.length,
                    lexicalTextSpans: allLexicalText.length,
                    container: finalContainer ? 'found' : 'not found',
                    containerTag: finalContainer ? finalContainer.tagName : 'N/A'
                });

                // If we have data-index elements but didn't collect them, there might be an issue
                if (allDataIndex.length > 0) {
                    logWarning(`Pre-fetch: Found ${allDataIndex.length} [data-index] elements but collected 0. Checking first element...`);
                    const firstItem = allDataIndex[0];
                    const firstDataIndex = firstItem.getAttribute('data-index');
                    const firstPrompt = firstItem.querySelector('span[data-lexical-text="true"]');
                    const firstImg = firstItem.querySelector('img[src*="cloudfront"]');
                    const firstCellId = firstItem.querySelector('[data-cell-id]');

                    logInfo(`Pre-fetch: First [data-index] element sample:`, {
                        dataIndex: firstDataIndex,
                        hasPrompt: !!firstPrompt,
                        hasImage: !!firstImg,
                        hasCellId: !!firstCellId,
                        tagName: firstItem.tagName,
                        className: firstItem.className.substring(0, 100) // First 100 chars
                    });
                }
            }

            window.prefetchState.totalItems = collectedItems.size;

            // Scroll and collect until no new items appear (with cancellation support)
            while (safety < MAX_SAFETY_COUNT && scrollAttempts < MAX_SCROLL_ATTEMPTS && !window.prefetchState.isCancelled) {
                // Check for pause
                while (window.prefetchState.isPaused && !window.prefetchState.isCancelled) {
                    await sleep(200);
                }
                if (window.prefetchState.isCancelled) break;

                // Scroll down
                if (scrollable.isContainer) {
                    scrollable.element.scrollTop += SCROLL_STEP;
                } else {
                    scrollable.element.scrollBy(0, SCROLL_STEP);
                }
                scrollAttempts++;

                // Wait for lazy loading
                await sleep(WAIT_MS);

                // Scrape visible items
                scrapeVisible();

                // Update progress
                window.prefetchState.totalItems = collectedItems.size;
                window.prefetchState.currentProgress = scrollAttempts;

                // Check if we found new items
                if (collectedItems.size === lastSize) {
                    safety++;
                } else {
                    safety = 0;
                    lastSize = collectedItems.size;
                }

                // Progress update every 10 scrolls (but limit to avoid spam)
                if (scrollAttempts % 10 === 0 && scrollAttempts <= 100) {
                    toastManager.info(`Pre-fetch: Found ${collectedItems.size} items so far...`);
                }

                // Check if we've reached the bottom
                let isAtBottom = false;
                if (scrollable.isContainer) {
                    const container = scrollable.element;
                    isAtBottom = (container.scrollTop + container.clientHeight) >= (container.scrollHeight - 100);
                } else {
                    isAtBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 100);
                }

                if (isAtBottom && safety >= 2) {
                    logInfo('Pre-fetch: Reached bottom of page');
                    break;
                }
            }

            if (window.prefetchState.isCancelled) {
                logInfo('Pre-fetch: Cancelled by user');
                toastManager.warning('Pre-fetch cancelled');
                return [];
            }

            logInfo(`Pre-fetch: Collection complete. Found ${collectedItems.size} items after scrolling`);
            toastManager.success(`Collected ${collectedItems.size} items. Video URLs will be extracted on-demand.`);

            // PHASE 2: Convert collected items to video data structure (NO video URL extraction here)
            // Video URLs will be extracted on-demand in the modal using grid layout
            const prefetchedVideos = [];
            const seenIdentifiers = new Set();

            // Sort items by dataIndex
            const itemsArray = Array.from(collectedItems.values()).sort((a, b) => {
                if (a.dataIndex !== null && b.dataIndex !== null) {
                    return Number(a.dataIndex) - Number(b.dataIndex);
                }
                return 0;
            });

            // Convert to video data structure (without video URLs)
            for (const item of itemsArray) {
                if (window.prefetchState.isCancelled) break;

                const { prompt, thumbnailUrl, cellId, dataIndex } = item;
                const identifier = cellId || dataIndex;

                // Skip duplicates
                if (!identifier || seenIdentifiers.has(identifier)) continue;
                seenIdentifiers.add(identifier);

                // Try to get prompt from existing queue/history/mapping if not found
                let finalPrompt = prompt;
                let finalThumbnailUrl = thumbnailUrl;
                let originalId = identifier;

                if (!finalPrompt) {
                    const mapping = HFStorage.getMapping();
                    const cellMapping = mapping[identifier];
                    if (cellMapping) {
                        const queueItem = STATE.queue.find(item => item.id === cellMapping.queueId);
                        if (queueItem) {
                            finalPrompt = queueItem.prompt || '';
                            finalThumbnailUrl = finalThumbnailUrl || queueItem.imgUrl || null;
                            originalId = queueItem.id;
                        } else {
                            const historyItem = HFStorage.getHistory().find(item => item.id === cellMapping.queueId);
                            if (historyItem) {
                                finalPrompt = historyItem.prompt || '';
                                finalThumbnailUrl = finalThumbnailUrl || historyItem.imgUrl || null;
                                originalId = historyItem.id;
                            }
                        }
                    }
                }

                // Create video data WITHOUT video URL (will be extracted on-demand)
                const videoData = {
                    cellId: cellId || null,
                    dataIndex: dataIndex || null,
                    thumbnailUrl: finalThumbnailUrl || null,
                    videoUrl: null, // Will be extracted on-demand in modal
                    prompt: finalPrompt || '',
                    originalId: originalId,
                    status: 'pending', // Will be updated when video URL is extracted
                    discoveredAt: Date.now()
                };

                prefetchedVideos.push(videoData);
            }

            logSuccess(`Pre-fetch complete: Discovered ${prefetchedVideos.length} items`, {
                totalItems: collectedItems.size,
                videosFound: prefetchedVideos.length,
                withPrompt: prefetchedVideos.filter(v => v.prompt).length
            });

            // Store the data for reuse
            window.prefetchedVideosData = prefetchedVideos;

            return prefetchedVideos;
        } finally {
            // Reset state
            window.prefetchState.isRunning = false;
            window.prefetchState.isPaused = false;
            window.prefetchState.currentProgress = 0;

            // Update button state
            const prefetchBtn = document.getElementById('hf-btn-prefetch');
            if (prefetchBtn) {
                prefetchBtn.disabled = false;
                prefetchBtn.classList.remove('loading');
                const btnLabel = prefetchBtn.querySelector('.btn-label');
                if (btnLabel) btnLabel.textContent = 'Pre-Fetch';
            }
        }
    }

    async function processNextItem() {
        if (!STATE.isProcessing || STATE.isPaused) return;

        // Find next pending item
        const item = STATE.queue.find(i => i.status === 'Pending');
        if (!item) {
            logInfo('Queue complete - no more pending items');
            updateStatus("All Completed!");
            STATE.isProcessing = false;
            generationObserver.stop();
            return;
        }

        try {
            logInfo(`processNextItem: Starting processing for item ${item.id}`, {
                itemId: item.id,
                prompt: item.prompt.substring(0, 50),
                status: item.status,
                hasImgUrl: !!item.imgUrl,
                timestamp: item.timestamp || 'missing'
            });
            updateStatus(`Processing ID ${item.id}...`);
            item.status = 'Start';

            // Ensure timestamp exists (use existing from import or set to now)
            if (!item.timestamp) {
                item.timestamp = Date.now();
                logInfo(`processNextItem: Set missing timestamp for item ${item.id}`, { timestamp: item.timestamp });
            }

            logRow(item);

            // STEP 0: CLEANUP (Mandatory)
            await ensureCleanDropzone();

            // STEP 1: UPLOAD IMAGE
            let imageUploaded = false;
            if (item.imgUrl && item.imgUrl.includes('http')) {
                logInfo(`Item ${item.id}: Downloading image from ${item.imgUrl.substring(0, 50)}...`);
                item.status = 'Downloading Img';
                logRow(item);

                const blob = await fetchImageBlob(item.imgUrl);
                if (blob) {
                    logInfo(`Item ${item.id}: Image downloaded, uploading to dropzone...`);
                    item.status = 'Uploading...';
                    logRow(item);
                    await uploadImageToDropzone(blob, item.id);
                    logSuccess(`Item ${item.id}: Image uploaded successfully`);
                    imageUploaded = true;
                } else {
                    logError(`Item ${item.id}: Failed to download image from URL`);
                    console.error("Failed to download image from URL");
                    item.status = 'Error';
                    item.errorMessage = 'Failed to download image';
                    logRow(item);
                    setTimeout(processNextItem, 2000);
                    return;
                }
            } else if (item.imgUrl) {
                // Image URL exists but is invalid
                logWarning(`Item ${item.id}: Invalid image URL, skipping image upload`);
            }

            // STEP 2: SET PROMPT
            logInfo(`Item ${item.id}: Setting prompt text...`);
            item.status = 'Setting Prompt';
            logRow(item);
            await setPromptText(item.prompt);
            logSuccess(`Item ${item.id}: Prompt set successfully`);

            // STEP 3: GENERATE - Decoupled approach
            // Get currently visible cell IDs AND already mapped cell IDs to avoid duplicates
            const oldCellIds = getVisibleCellIds();
            // Also include all cell IDs that are already mapped to items in our queue
            STATE.queue.forEach(qItem => {
                if (qItem.cellId) {
                    oldCellIds.add(qItem.cellId);
                }
            });
            // Include all cell IDs from storage mappings
            const storedMappings = HFStorage.getMapping();
            Object.keys(storedMappings).forEach(cellId => {
                oldCellIds.add(cellId);
            });

            logInfo(`Item ${item.id}: Clicking generate button...`);
            item.status = 'Clicking Gen';
            logRow(item);
            const genClicked = await clickGenerate();

            if (!genClicked) {
                logError(`Item ${item.id}: Generate button not found`);
                throw new Error("Generate button not found");
            }
            logSuccess(`Item ${item.id}: Generate button clicked`);

            // STEP 4: TRACKING - Wait briefly for new cell to appear, then map and continue
            logInfo(`Item ${item.id}: Waiting for generation to start...`);
            item.status = 'Waiting Start...';
            logRow(item);

            // Wait up to 30 seconds for new cell to appear
            logInfo(`processNextItem: Waiting for new generation cell for item ${item.id}`, {
                itemId: item.id,
                oldCellIdsCount: oldCellIds.size,
                oldCellIds: Array.from(oldCellIds).slice(0, 5) // Log first 5 for debugging
            });
            const newCellId = await waitForNewGeneration(oldCellIds);

            if (newCellId) {
                logSuccess(`processNextItem: Generation started for item ${item.id}`, {
                    itemId: item.id,
                    newCellId: newCellId,
                    status: 'Generating',
                    timestamp: item.timestamp
                });
                item.cellId = newCellId;
                item.status = 'Generating';

                // Ensure timestamp exists (use existing or set to now)
                if (!item.timestamp) {
                    item.timestamp = Date.now();
                    logInfo(`processNextItem: Set missing timestamp for item ${item.id} after cell detection`, { timestamp: item.timestamp });
                }

                // Store mapping in both memory and persistent storage
                STATE.generationMap.set(newCellId, item);
                HFStorage.addMapping(newCellId, item.id, 'processing');
                logInfo(`processNextItem: Mapped item ${item.id} to cell ${newCellId}`, {
                    itemId: item.id,
                    cellId: newCellId,
                    mappingSize: STATE.generationMap.size
                });

                logRow(item);

                // Start observer if not running
                if (!generationObserver.isRunning) {
                    logInfo(`processNextItem: Starting generation observer for item ${item.id}`);
                    generationObserver.start();
                }
            } else {
                logError(`processNextItem: Generation timeout for item ${item.id}`, {
                    itemId: item.id,
                    oldCellIdsCount: oldCellIds.size,
                    timeout: '30 seconds'
                });
                item.status = 'Gen Unknown (Timeout)';
                logRow(item);
            }

            // Don't wait for video - proceed immediately to next item
            await sleep(1000); // Brief delay to ensure backend registered
            setTimeout(processNextItem, 500);

        } catch (e) {
            logError(`processNextItem: Failed to process item ${item.id}`, {
                itemId: item.id,
                error: e.message,
                errorStack: e.stack,
                itemStatus: item.status,
                itemCellId: item.cellId,
                itemPrompt: item.prompt?.substring(0, 50),
                errorObject: e
            });
            console.error('[processNextItem] Error details:', e);
            item.status = 'Error';
            item.errorMessage = e.message;
            logRow(item);
            setTimeout(processNextItem, 3000);
        }
    }

    // --- DOM INTERACTION HELPERS ---

    // 1. Ensure Dropzone is empty
    async function ensureCleanDropzone() {
        console.log("Checking dropzone state...");
        const dropzone = document.querySelector('#form-video-dropzones');
        if (!dropzone) throw new Error("Dropzone not found in DOM");

        // Check for File Input
        let input = dropzone.querySelector('input#imageUrl[type="file"]');
        if (input) {
            console.log("Dropzone is clean.");
            return;
        }

        // If no input, look for the Remove button (usually top right SVG)
        // It's usually a button inside the dropzone wrapper
        const btns = Array.from(dropzone.querySelectorAll('button'));
        // The remove button usually has no text, just an icon.
        const removeBtn = btns.find(b => b.innerHTML.includes('<svg') || !b.innerText.trim());

        if (removeBtn) {
            console.log("Image found. Clicking remove...");
            removeBtn.click();

            // Wait for input to reappear
            let attempts = 0;
            while (attempts < 10) {
                await sleep(500);
                input = dropzone.querySelector('input#imageUrl');
                if (input) {
                    console.log("Dropzone cleaned.");
                    return;
                }
                attempts++;
            }
            throw new Error("Failed to clean dropzone");
        }
    }

    // 2. Upload Image
    async function uploadImageToDropzone(blob, id) {
        const dropzone = document.querySelector('#form-video-dropzones');
        const input = dropzone.querySelector('input#imageUrl');
        if (!input) throw new Error("Input not found for upload");

        const file = new File([blob], `upload_${id}.jpg`, { type: 'image/jpeg' });
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;

        // Trigger React events
        input.dispatchEvent(new Event('change', { bubbles: true }));

        // Wait for preview image to appear
        let attempts = 0;
        while (attempts < 20) { // 10 seconds timeout
            await sleep(500);
            // Look for img tag that isn't the placeholder icon?
            // Usually Higgsfield replaces the input content with an <img>
            // Or look for the 'Remove' button appearing
            const removeBtn = dropzone.querySelector('button');
            if (removeBtn) {
                console.log("Image uploaded successfully.");
                return;
            }
            attempts++;
        }
        console.warn("Upload timeout - proceeding anyway");
    }

    // 3. Set Prompt (React Hack)
    async function setPromptText(text) {
        const textarea = document.getElementById('prompt');
        if (!textarea) throw new Error("Prompt textarea not found");

        textarea.focus();

        // React Value Setter
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(textarea, text);

        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        await sleep(500);
    }

    // 4. Click Generate
    async function clickGenerate() {
        // Find the main generate button (usually at bottom of sidebar)
        // Selector: button with text "Generate" inside the form
        const buttons = Array.from(document.querySelectorAll('form button'));
        const genBtn = buttons.find(b => b.innerText.includes('Generate') || (b.type === 'submit' && !b.disabled));

        if (genBtn) {
            genBtn.click();
            return true;
        }
        return false;
    }

    // 5. Track Generation
    function getVisibleCellIds() {
        // Use helper function to find container (works for both grid and list layouts)
        const container = findGridContainer();
        if (!container) {
            return new Set();
        }

        // Use helper function to get all cell elements
        const cellElements = getAllCellElements(container);
        const ids = new Set();

        cellElements.forEach(element => {
            const id = extractCellId(element);
            if (id) ids.add(id);
        });

        return ids;
    }

    async function waitForNewGeneration(oldIds) {
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds wait for generation to start

        // Augment oldIds with all currently mapped cell IDs to prevent re-using them
        const allMappedCellIds = new Set(oldIds);
        STATE.queue.forEach(qItem => {
            if (qItem.cellId) allMappedCellIds.add(String(qItem.cellId));
        });
        Object.keys(HFStorage.getMapping()).forEach(cellId => allMappedCellIds.add(cellId));

        logInfo(`Waiting for new generation cell. Current cells: ${allMappedCellIds.size}`, { oldIds: Array.from(allMappedCellIds) });

        while (attempts < maxAttempts) {
            await sleep(1000);

            // Use helper function to find container (works for both grid and list layouts)
            const container = findGridContainer();
            if (!container) {
                if (attempts % 5 === 0) {
                    logWarning(`Container not found (attempt ${attempts}/${maxAttempts})`);
                }
                attempts++;
                continue;
            }

            // Use helper function to get all cell elements (works for both layouts)
            const cellElements = getAllCellElements(container);

            const currentIds = new Set();
            cellElements.forEach(element => {
                // Use helper function to extract cell ID (works for both layouts)
                const cellId = extractCellId(element);
                if (cellId) currentIds.add(cellId);
            });

            // Debug logging
            if (attempts % 5 === 0) {
                logInfo(`Waiting for generation... (${attempts}/${maxAttempts}). Found ${currentIds.size} cells, looking for new ones.`, {
                    currentIds: Array.from(currentIds),
                    oldIds: Array.from(allMappedCellIds) // Use allMappedCellIds for comparison
                });
            }

            // Find ID that wasn't there before AND is not already mapped to another item
            for (const id of currentIds) {
                if (!allMappedCellIds.has(id)) { // Check against all mapped IDs
                    logSuccess(`New generation cell detected: ${id}`, { newId: id, allCurrentIds: Array.from(currentIds) });
                    return id;
                }
            }

            attempts++;
        }
        logError(`Generation timeout after ${maxAttempts} seconds. Could not detect new cell.`, {
            oldIds: Array.from(allMappedCellIds),
            finalContainer: findGridContainer() ? 'found' : 'not found'
        });
        return null;
    }

    // --- DOWNLOADER OBSERVER ---
    function initDownloader() {
        // Use GenerationObserver instead of separate observer
        generationObserver.start();
    }

    /**
     * Extract video URL from a cell element by simulating hover
     * Videos are injected on hover, so we need to trigger mouseenter and wait for video injection
     * Pattern: https://d8j0ntlcm91z4.cloudfront.net/[user_id_hash]/hf_YYYYMMDD_HHMMSS_<data-cell-id>.mp4
     */
    async function extractVideoFromCell(cellElement) {
        if (!cellElement) {
            logWarning('extractVideoFromCell: cellElement is null or undefined');
            return null;
        }

        const cellId = extractCellId(cellElement);
        if (!cellId) {
            logWarning('extractVideoFromCell: No cellId found in element', { element: cellElement.tagName, classes: cellElement.className });
            return null;
        }

        logInfo(`extractVideoFromCell: Starting extraction for cell ${cellId}`);

        // Check if we already have a cached video URL for this cell
        const cachedVideoUrl = window._videoUrlCache && window._videoUrlCache.get(cellId);
        if (cachedVideoUrl) {
            logInfo(`extractVideoFromCell: Using cached video URL for cell ${cellId}`, { cachedUrl: cachedVideoUrl.substring(0, 80) });
            return cachedVideoUrl;
        }

        // Check if video already exists in DOM
        let video = cellElement.querySelector('video');
        if (!video) {
            // Try finding video in parent or siblings (list layout may have nested structure)
            const parent = cellElement.parentElement;
            if (parent) {
                video = parent.querySelector('video');
                if (!video && parent.parentElement) {
                    video = parent.parentElement.querySelector('video');
                }
            }
        }

        // If video exists with src, use it
        if (video && video.src && (video.src.includes('.mp4') || video.src.includes('cloudfront'))) {
            // Cache the result
            if (!window._videoUrlCache) {
                window._videoUrlCache = new Map();
            }
            window._videoUrlCache.set(cellId, video.src);
            logSuccess(`extractVideoFromCell: Found video URL in DOM for cell ${cellId}`, {
                cellId,
                videoUrl: video.src.substring(0, 80),
                method: 'direct_dom_lookup'
            });
            return video.src;
        }

        // Video not found - simulate hover to trigger injection
        logInfo(`extractVideoFromCell: Video not found in DOM, simulating hover on cell ${cellId} to trigger injection...`, { cellId });

        // Create and dispatch mouseenter event to simulate hover
        const mouseEnterEvent = new MouseEvent('mouseenter', {
            bubbles: true,
            cancelable: true
        });
        cellElement.dispatchEvent(mouseEnterEvent);

        // Also try mouseover (some frameworks use this)
        const mouseOverEvent = new MouseEvent('mouseover', {
            bubbles: true,
            cancelable: true
        });
        cellElement.dispatchEvent(mouseOverEvent);

        // Wait for video to be injected (check every 200ms, up to 5 seconds)
        let attempts = 0;
        const maxAttempts = 25; // 5 seconds

        while (attempts < maxAttempts) {
            await sleep(200);

            // Check for video element again
            video = cellElement.querySelector('video');
            if (!video) {
                const parent = cellElement.parentElement;
                if (parent) {
                    video = parent.querySelector('video');
                    if (!video && parent.parentElement) {
                        video = parent.parentElement.querySelector('video');
                    }
                }
            }

            // Check if video has src
            if (video && video.src && (video.src.includes('.mp4') || video.src.includes('cloudfront'))) {
                // Cache the result
                if (!window._videoUrlCache) {
                    window._videoUrlCache = new Map();
                }
                window._videoUrlCache.set(cellId, video.src);
                logSuccess(`extractVideoFromCell: Video URL extracted from cell ${cellId} after hover`, {
                    cellId,
                    videoUrl: video.src.substring(0, 80),
                    method: 'hover_simulation',
                    attempts: attempts + 1,
                    timeElapsed: (attempts + 1) * 200
                });
                return video.src;
            }

            attempts++;
        }

        // Cleanup: dispatch mouseleave to remove hover state
        const mouseLeaveEvent = new MouseEvent('mouseleave', {
            bubbles: true,
            cancelable: true
        });
        cellElement.dispatchEvent(mouseLeaveEvent);

        logWarning(`extractVideoFromCell: Video URL not found for cell ${cellId} after ${maxAttempts} attempts`, {
            cellId,
            maxAttempts,
            timeElapsed: maxAttempts * 200,
            elementText: cellElement.textContent?.substring(0, 100)
        });
        return null;
    }

    /**
     * Extract video ID from Higgsfield video URL
     * URLs typically contain UUIDs like: https://.../video/[uuid].mp4 or .../[uuid]/video.mp4
     */
    function extractVideoIdFromUrl(url) {
        if (!url) return null;

        // Try to extract UUID from URL (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
        const uuidPattern = /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i;
        const match = url.match(uuidPattern);
        if (match) {
            return match[1];
        }

        // Fallback: try to extract from path segments
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/').filter(p => p);
            // Look for UUID-like segments
            for (const part of pathParts) {
                if (uuidPattern.test(part)) {
                    return part.match(uuidPattern)[1];
                }
            }
            // If no UUID found, use the last meaningful segment before .mp4
            const lastPart = pathParts[pathParts.length - 1];
            if (lastPart && lastPart.includes('.mp4')) {
                return lastPart.replace('.mp4', '').substring(0, 36); // Limit to UUID length
            }
        } catch (e) {
            console.warn('Failed to parse URL for video ID:', e);
        }

        // Last resort: use a hash of the URL
        return null;
    }

    function downloadVideo(url, item, cellId) {
        // Check auto-download setting
        const autoDownload = HFStorage.getAutoDownload();
        console.log(`[downloadVideo] Auto-download setting: ${autoDownload} for item ${item.id}`);

        if (!autoDownload) {
            logInfo(`Auto-download disabled. Video ready for ${item.id} but not downloading.`);
            // Still mark as ready, just don't download
            item.status = 'Ready';
            item.videoUrl = url;

            // Extract and map video ID even if not downloading
            const videoId = extractVideoIdFromUrl(url);
            if (videoId) {
                HFStorage.addVideoMapping(videoId, {
                    originalId: item.id,
                    originalPrompt: item.prompt,
                    originalImgUrl: item.imgUrl || '',
                    cellId: cellId || null,
                    index: item.index || null,
                    videoUrl: url,
                    status: 'ready'
                });
            }

            HFStorage.saveQueue(STATE.queue);
            logRow(item);
            return;
        }

        // Prevent double downloads
        if (item.status === 'Success' || item.status === 'Downloading' || HFStorage.isDownloaded(item.id)) {
            logWarning(`Skipping duplicate download for item ${item.id} (status: ${item.status})`);
            return;
        }

        logInfo(`downloadVideo: Starting download for item ${item.id}`, {
            itemId: item.id,
            videoUrl: url.substring(0, 80),
            cellId: cellId || 'none',
            autoDownload: autoDownload,
            itemStatus: item.status
        });

        // Extract video ID from URL
        const videoId = extractVideoIdFromUrl(url);
        if (videoId) {
            logInfo(`downloadVideo: Extracted video ID ${videoId} from URL`, { itemId: item.id, videoId });
        } else {
            logWarning(`downloadVideo: Could not extract video ID from URL`, { itemId: item.id, videoUrl: url.substring(0, 80) });
        }

        // Create filename: ${Index}_${OriginalID}_${PromptSnippet}.mp4
        // Use index if available, otherwise use original ID
        const index = item.index !== undefined && item.index !== null ? String(item.index).padStart(4, '0') : item.id;
        const cleanPrompt = (item.prompt || '').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
        const filename = `${index}_${item.id}_${cleanPrompt}.mp4`;

        // Mark as downloading (not Success yet)
        item.status = 'Downloading';
        item.filename = filename;
        item.videoUrl = url;
        item.videoId = videoId; // Store video ID in item

        // Ensure timestamp exists
        if (!item.timestamp) {
            item.timestamp = Date.now();
        }

        logRow(item);
        HFStorage.saveQueue(STATE.queue);

        // Create comprehensive mapping BEFORE download
        if (videoId) {
            HFStorage.addVideoMapping(videoId, {
                originalId: item.id,
                originalPrompt: item.prompt,
                originalImgUrl: item.imgUrl || '',
                cellId: cellId || null,
                index: item.index || null,
                videoUrl: url,
                filename: filename,
                status: 'downloading'
            });
        }

        GM_download({
            url: url,
            name: filename,
            onload: () => {
                const timestamp = Date.now();
                logSuccess(`downloadVideo: Download completed successfully for item ${item.id}`, {
                    itemId: item.id,
                    filename: filename,
                    videoId: videoId || 'unknown',
                    cellId: cellId || 'none',
                    timestamp: timestamp,
                    downloadDuration: timestamp - (item.timestamp || timestamp)
                });
                item.status = 'Success';
                item.downloadedAt = timestamp;

                // Track as downloaded
                HFStorage.addDownloadedFile(item.id);

                // Update video mapping with success status
                if (videoId) {
                    HFStorage.addVideoMapping(videoId, {
                        originalId: item.id,
                        originalPrompt: item.prompt,
                        originalImgUrl: item.imgUrl || '',
                        cellId: cellId || null,
                        index: item.index || null,
                        videoUrl: url,
                        filename: filename,
                        status: 'success',
                        downloadedAt: timestamp
                    });
                }

                // Save comprehensive download log
                HFStorage.addDownloadLog({
                    queueId: item.id,
                    videoId: videoId,
                    filename: filename,
                    videoUrl: url,
                    prompt: item.prompt,
                    imgUrl: item.imgUrl || '',
                    cellId: cellId || null,
                    index: item.index || null,
                    status: 'success',
                    downloadedAt: timestamp
                });

                // Add to history with full mapping
                HFStorage.addToHistory({
                    ...item,
                    videoId: videoId,
                    downloadedAt: timestamp
                });

                // Remove from cell mapping
                if (cellId) {
                    HFStorage.removeMapping(cellId);
                    STATE.generationMap.delete(cellId);
                }

                logRow(item);
                HFStorage.saveQueue(STATE.queue);

                logSuccess(`Downloaded: ${filename}`, { itemId: item.id, videoId, filename });
                console.log(`Downloaded ${filename} (Video ID: ${videoId || 'unknown'})`);
                toastManager.success(`Downloaded: ${filename}`);

                // Update dashboard if open
                if (window.updateDashboardTable) {
                    window.updateDashboardTable();
                }
            },
            onerror: (err) => {
                logError(`downloadVideo: Download failed for item ${item.id}`, {
                    itemId: item.id,
                    error: err.error || 'Unknown error',
                    errorDetails: err,
                    videoUrl: url.substring(0, 80),
                    filename: filename,
                    videoId: videoId || 'unknown',
                    cellId: cellId || 'none'
                });
                console.error('[downloadVideo] Download error details:', err);
                item.status = 'Download Error';
                item.errorMessage = err.error || 'Unknown error';

                // Update video mapping with error status
                if (videoId) {
                    HFStorage.addVideoMapping(videoId, {
                        originalId: item.id,
                        originalPrompt: item.prompt,
                        originalImgUrl: item.imgUrl || '',
                        cellId: cellId || null,
                        index: item.index || null,
                        videoUrl: url,
                        filename: filename,
                        status: 'error',
                        error: err.error || 'Unknown error'
                    });
                }

                // Save error to download log
                HFStorage.addDownloadLog({
                    queueId: item.id,
                    videoId: videoId,
                    filename: filename,
                    videoUrl: url,
                    prompt: item.prompt,
                    imgUrl: item.imgUrl || '',
                    cellId: cellId || null,
                    index: item.index || null,
                    status: 'error',
                    error: err.error || 'Unknown error'
                });

                logRow(item);
                HFStorage.saveQueue(STATE.queue);
                toastManager.error(`Download failed: ${item.id}`);
            }
        });
    }

    // --- UTILS ---
    async function fetchImageBlob(url) {
        // Handle Google Drive Links
        let downloadUrl = url;
        const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
        if (idMatch) {
            downloadUrl = `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
        }

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: downloadUrl,
                responseType: "blob",
                onload: (res) => {
                    if (res.status === 200) resolve(res.response);
                    else resolve(null);
                },
                onerror: () => resolve(null)
            });
        });
    }

    // --- INIT ---
    // Keep trying to build UI until DOM is ready (React hydration)
    const initInterval = setInterval(() => {
        if (document.querySelector('main')) {
            buildUI();
            try {
                injectIonicons();
                console.log('[Higgsfield Automation] All libraries initialized');
            } catch (error) {
                console.error('[Higgsfield Automation] Error initializing libraries:', error);
            }

            // Start observer if there are items in Generating status
            const hasGenerating = STATE.queue.some(item =>
                item.status === 'Generating' || item.status === 'Gen Unknown (Timeout)'
            );

            if (hasGenerating) {
                // Wait a bit for DOM to be fully ready
                setTimeout(() => {
                    generationObserver.start();
                    console.log('GenerationObserver started on init (found generating items)');
                }, 2000);
            } else {
                // Still initialize for future use
                initDownloader();
            }

            clearInterval(initInterval);
        }
    }, 4000);

})();