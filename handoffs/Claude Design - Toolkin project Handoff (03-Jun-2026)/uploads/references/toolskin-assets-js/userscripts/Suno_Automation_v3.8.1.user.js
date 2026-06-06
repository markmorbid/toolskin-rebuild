// ==UserScript==
// @name         Suno Automation & Downloader v3.8.1
// @namespace    http://tampermonkey.net/
// @version      v3.8.1
// @description  Automate clicks and downloads on Suno with unified UI, bulk downloader, and table-based tracking
// @author       SatoshiSea
// @match        https://suno.com/*
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @resource     IMPORTED_CSS https://satsea.io/video-calendar/userscript_suno_styles9.1.css
// @grant        GM_getResourceText
// @connect      satsea.io
// @grant        unsafeWindow
// @connect      suno.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suno.com
// ==/UserScript==

(function () {
    'use strict';

    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const importedCSS = GM_getResourceText('IMPORTED_CSS');
    GM_addStyle(importedCSS);
    /**************************************************************
     *   GLOBAL STATE
     **************************************************************/

    let stopClicks = false;
    let dataKeyQueue = [];
    let downloadedKeys = [];
    let totalClicks = 0;
    let totalDownloads = 0;
    let total403s = 0;
    let consecutive403s = 0;
    let CLICK_LIMIT = 0;
    let DOWNLOAD_LIMIT = 0;
    let scriptStartTime = null;
    let initialTrackIds = new Set();
    let trackMetadata = new Map();
    let filenameCounts = {};
    let processCounter = 0;
    let currentlyDownloading = new Set(); // Track downloads in progress to prevent duplicates

    /**************************************************************
     *   UNIFIED BULK DOWNLOADER STATE
     **************************************************************/

    // Unified state - single source of truth for bulk operations
    let bulkDownloaderState = {
        // Process state
        isFetching: false,
        isDownloading: false,
        isPaused: false,
        isStopped: false,
        activeProcess: null, // 'fetch' | 'download' | null

        // Fetch state
        fetch: {
            allSongs: new Map(),
            processedPages: 0,
            titleCounts: {},
            seenUrls: new Set(),
            source: null, // workspace/playlist/library tab
            scrollAttempts: 0,
            consecutiveEmptyPages: 0
        },

        // Download state
        download: {
            tracks: [],
            currentIndex: 0,
            total: 0,
            downloaded: 0,
            failed: 0,
            skipped: 0
        },

        // Logging
        logs: [],
        debugMode: GM_getValue('bulk_debug_mode', false)
    };

    // Legacy fetchState for backward compatibility during migration
    let fetchState = {
        get fetching() { return bulkDownloaderState.isFetching; },
        set fetching(v) { bulkDownloaderState.isFetching = v; },
        get paused() { return bulkDownloaderState.isPaused; },
        set paused(v) { bulkDownloaderState.isPaused = v; },
        get stopped() { return bulkDownloaderState.isStopped; },
        set stopped(v) { bulkDownloaderState.isStopped = v; },
        get allSongs() { return bulkDownloaderState.fetch.allSongs; },
        set allSongs(v) { bulkDownloaderState.fetch.allSongs = v; },
        get processedPages() { return bulkDownloaderState.fetch.processedPages; },
        set processedPages(v) { bulkDownloaderState.fetch.processedPages = v; },
        get titleCounts() { return bulkDownloaderState.fetch.titleCounts; },
        set titleCounts(v) { bulkDownloaderState.fetch.titleCounts = v; },
        get seenUrls() { return bulkDownloaderState.fetch.seenUrls; },
        set seenUrls(v) { bulkDownloaderState.fetch.seenUrls = v; },
        download: {
            get inProgress() { return bulkDownloaderState.isDownloading; },
            set inProgress(v) { bulkDownloaderState.isDownloading = v; },
            get paused() { return bulkDownloaderState.isPaused && bulkDownloaderState.activeProcess === 'download'; },
            set paused(v) { if (v) bulkDownloaderState.isPaused = true; },
            get index() { return bulkDownloaderState.download.currentIndex; },
            set index(v) { bulkDownloaderState.download.currentIndex = v; },
            get failed() { return bulkDownloaderState.download.failed; },
            set failed(v) { bulkDownloaderState.download.failed = v; }
        }
    };

    /**************************************************************
     *   GM STORAGE KEYS & PERSISTENCE
     **************************************************************/
    const GM_KEYS = {
        downloadedTracks: 'suno_downloaded_tracks',
        downloadedBulk: 'suno_bulk_downloaded',
        trackHistory: 'suno_track_history', // Full track history with metadata
        tooltipsEnabled: 'suno_tooltips_enabled',
        panelPosition: 'suno_panel_position',
        gradientButtons: 'suno_gradient_buttons',
        optimizeUI: 'suno_optimize_ui',
        disableBlur: 'suno_disable_blur',
        lightboxEnabled: 'suno_lightbox_enabled',
        layoutVersion: 'suno_layout_version', // Layout version: 'v1' | 'v2' (default: 'v1')
        // Deduplication system keys
        downloadedMatches: 'suno_downloaded_matches', // Tracks matched with local files (no-dupe list)
        importedFiles: 'suno_imported_files', // Imported audio file metadata for comparison
        lastFetchState: 'suno_last_fetch_state', // Cumulative fetch state persistence
        // Fetch Queue system keys
        fetchQueue: 'suno_fetch_queue', // Persisted queue of fetched tracks
        fetchQueueMeta: 'suno_fetch_queue_meta', // Queue metadata (timestamps, counts, state)
        downloadLog: 'suno_download_log', // Download history with filenames and status
        bulkDownloaderState: 'suno_bulk_downloader_state', // Unified bulk downloader state
        bulkDebugMode: 'bulk_debug_mode', // Debug mode toggle for bulk logger
        // Progress card state keys
        progressCardDocked: 'suno_progress_card_docked',
        progressCardVisible: 'suno_progress_card_visible',
        progressCardMode: 'suno_progress_card_mode',
        progressCardState: 'suno_progress_card_state'
    };

    /**************************************************************
     *   IMAGE ERROR HANDLING - Placeholder and batch logging
     **************************************************************/

    // Placeholder image SVG (music note icon)
    const PLACEHOLDER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="4" fill="#2a2a2a"/>
                <path d="M32 14v16a4 4 0 11-4-4h2V18l-12 3v11a4 4 0 11-4-4h2V17l16-4z" fill="#666"/>
            </svg>
        `.trim());

    // Track image errors to avoid spamming console
    const imageErrorsLogged = new Set();

    /**
     * Handle image load error with placeholder fallback
     * @param {HTMLImageElement} img - The image element
     * @param {string} url - Original URL that failed
     */
    const handleImageError = (img, url) => {
        // Log error once per URL per session
        if (url && !imageErrorsLogged.has(url)) {
            imageErrorsLogged.add(url);
            // Only log summary after multiple failures
            if (imageErrorsLogged.size === 1) {
                log('⚠️ Some thumbnail images failed to load (403/404). Using placeholders.');
            }
        }
        // Set placeholder and prevent infinite loop
        img.src = PLACEHOLDER_IMAGE;
        img.onerror = null;
    };

    // Track history - persistent storage of all downloads with metadata
    let trackHistory = [];

    // Load track history from persistent storage
    const loadTrackHistory = () => {
        try {
            const stored = GM_getValue(GM_KEYS.trackHistory, '[]');
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                trackHistory = parsed;
                log(`Loaded ${trackHistory.length} tracks from history`);
            }
        } catch (e) {
            console.error('Failed to load track history:', e);
            trackHistory = [];
        }
    };

    // Save track to history with full metadata
    const saveTrackToHistory = (trackData) => {
        const { id, title, url, source, duration, styles, timestamp, generationStarted, downloadedAt, downloadFilename, downloadPath, initialText, generationSettings, fileSize } = trackData;

        // Check if already exists by ID or URL
        const trackId = id || extractIdFromUrl(url);
        const existingIndex = trackHistory.findIndex(t => t.id === trackId || t.url === url);

        if (existingIndex >= 0) {
            // Update existing entry - PRESERVE original source, only update other fields if they have new values
            const existing = trackHistory[existingIndex];
            trackHistory[existingIndex] = {
                ...existing,
                // Only update if new value is provided and not just overwriting with default
                title: (title && title !== 'Unknown') ? title : existing.title,
                url: url || existing.url,
                // IMPORTANT: Preserve the original source - don't overwrite it
                source: existing.source || source || 'unknown',
                duration: duration || existing.duration,
                styles: styles || existing.styles,
                // Preserve generationStarted if it exists, otherwise use new value
                generationStarted: existing.generationStarted || generationStarted || timestamp || Date.now(),
                // Update downloadedAt only if we have a new download
                downloadedAt: downloadedAt || existing.downloadedAt || (trackData.downloadStatus === 'completed' ? timestamp : existing.downloadedAt),
                downloadFilename: downloadFilename || existing.downloadFilename || null,
                downloadPath: downloadPath || existing.downloadPath || null,
                initialText: initialText || existing.initialText || null,
                generationSettings: generationSettings || existing.generationSettings || null,
                fileSize: fileSize || existing.fileSize || null,
                genStatus: trackData.genStatus || existing.genStatus || 'ready',
                downloadStatus: trackData.downloadStatus || existing.downloadStatus || 'completed'
            };
        } else {
            // Add new entry
            const historyEntry = {
                id: trackId,
                title: title || 'Unknown',
                url: url || `https://cdn1.suno.ai/${trackId}.mp3`,
                source: source || 'unknown', // 'automation', 'bulk', 'manual'
                duration: duration || null,
                styles: styles || null,
                generationStarted: generationStarted || timestamp || Date.now(),
                downloadedAt: downloadedAt || (trackData.downloadStatus === 'completed' ? timestamp : null),
                downloadFilename: downloadFilename || null,
                downloadPath: downloadPath || null,
                initialText: initialText || null,
                generationSettings: generationSettings || null,
                fileSize: fileSize || null,
                genStatus: trackData.genStatus || 'ready',
                downloadStatus: trackData.downloadStatus || 'completed'
            };
            trackHistory.push(historyEntry);
        }

        try {
            GM_setValue(GM_KEYS.trackHistory, JSON.stringify(trackHistory));
        } catch (e) {
            console.error('Failed to save track history:', e);
        }
    };

    // Extract ID from CDN URL
    const extractIdFromUrl = (url) => {
        if (!url) return null;
        const match = url.match(/([a-f0-9-]{36})/i);
        return match ? match[1] : null;
    };

    // Check if track is already downloaded (by ID or URL)
    const isTrackDownloaded = (idOrUrl) => {
        if (!idOrUrl) return false;
        const id = extractIdFromUrl(idOrUrl) || idOrUrl;
        return downloadedKeys.includes(id) ||
            fetchState.seenUrls.has(idOrUrl) ||
            fetchState.seenUrls.has(id) ||
            trackHistory.some(t => t.id === id || t.url === idOrUrl);
    };

    // Load downloaded tracks from persistent storage
    const loadDownloadedTracks = () => {
        try {
            const stored = GM_getValue(GM_KEYS.downloadedTracks, '[]');
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                downloadedKeys = parsed;
                log(`📦 Loaded ${downloadedKeys.length} previously downloaded track IDs from storage`);
            }
        } catch (e) {
            console.error('Failed to load downloaded tracks:', e);
            downloadedKeys = [];
        }
    };

    // Save a downloaded track to persistent storage (automation downloads)
    const saveDownloadedTrack = (trackId, metadata = {}) => {
        if (!downloadedKeys.includes(trackId)) {
            downloadedKeys.push(trackId);
        }
        try {
            GM_setValue(GM_KEYS.downloadedTracks, JSON.stringify(downloadedKeys));

            // Also save to track history with full metadata
            saveTrackToHistory({
                id: trackId,
                url: `https://cdn1.suno.ai/${trackId}.mp3`,
                source: 'automation',
                ...metadata
            });
        } catch (e) {
            console.error('Failed to save downloaded track:', e);
        }
    };

    // Load bulk downloaded tracks from persistent storage
    const loadBulkDownloaded = () => {
        try {
            const stored = GM_getValue(GM_KEYS.downloadedBulk, '[]');
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                parsed.forEach(id => fetchState.seenUrls.add(id));
                log(`Loaded ${parsed.length} bulk downloaded track IDs from storage`);
            }
        } catch (e) {
            console.error('Failed to load bulk downloaded tracks:', e);
        }
    };

    // Save bulk downloaded track to persistent storage
    const saveBulkDownloaded = (trackId, metadata = {}) => {
        const id = extractIdFromUrl(trackId) || trackId;
        fetchState.seenUrls.add(id);
        fetchState.seenUrls.add(trackId);
        try {
            const allIds = Array.from(fetchState.seenUrls);
            GM_setValue(GM_KEYS.downloadedBulk, JSON.stringify(allIds));

            // Also save to track history with full metadata
            saveTrackToHistory({
                id: id,
                url: trackId.includes('http') ? trackId : `https://cdn1.suno.ai/${id}.mp3`,
                source: 'bulk',
                ...metadata
            });
        } catch (e) {
            console.error('Failed to save bulk downloaded track:', e);
        }
    };

    // Clear download history
    const clearDownloadHistory = (type = 'all') => {
        if (type === 'all' || type === 'automation') {
            downloadedKeys = [];
            GM_deleteValue(GM_KEYS.downloadedTracks);
            log('🗑️ Cleared automation download history');
        }
        if (type === 'all' || type === 'bulk') {
            fetchState.seenUrls.clear();
            GM_deleteValue(GM_KEYS.downloadedBulk);
            log('Cleared bulk download history');
        }
        if (type === 'all' || type === 'history') {
            trackHistory = [];
            GM_deleteValue(GM_KEYS.trackHistory);
            log('🗑️ Cleared full track history');
        }
        if (type === 'all' || type === 'matches') {
            downloadedMatches = {};
            GM_deleteValue(GM_KEYS.downloadedMatches);
            log('🗑️ Cleared downloaded matches (no-duple list)');
        }
        if (type === 'all' || type === 'imported') {
            importedFilesCache = [];
            GM_deleteValue(GM_KEYS.importedFiles);
            log('🗑️ Cleared imported files cache');
        }
    };

    /**************************************************************
     *   DEDUPLICATION SYSTEM - Downloaded Matches (No-Duple List)
     **************************************************************/

    // In-memory cache of downloaded matches
    let downloadedMatches = {};

    // Load downloaded matches from GM storage
    const loadDownloadedMatches = () => {
        try {
            const stored = GM_getValue(GM_KEYS.downloadedMatches, '{}');
            const parsed = JSON.parse(stored);
            if (typeof parsed === 'object' && parsed !== null) {
                downloadedMatches = parsed;
                log(`📋 Loaded ${Object.keys(downloadedMatches).length} downloaded matches from storage`);
            }
        } catch (e) {
            console.error('Failed to load downloaded matches:', e);
            downloadedMatches = {};
        }
        return downloadedMatches;
    };

    // Save downloaded matches to GM storage
    const saveDownloadedMatches = () => {
        try {
            GM_setValue(GM_KEYS.downloadedMatches, JSON.stringify(downloadedMatches));
        } catch (e) {
            console.error('Failed to save downloaded matches:', e);
        }
    };

    // Add a track to downloaded matches (mark as no-duple)
    const addToDownloadedMatches = (matchData) => {
        const { id, filename, duration, fileSize, downloadedAt, localPath } = matchData;
        if (!id) return false;

        downloadedMatches[id] = {
            id,
            filename: filename || '',
            duration: duration || null, // "3:24" format
            durationSeconds: matchData.durationSeconds || null, // seconds for comparison
            fileSize: fileSize || 0, // bytes
            fileSizeKB: fileSize ? Math.round(fileSize / 1024) : 0, // KB for comparison
            downloadedAt: downloadedAt || Date.now(),
            localPath: localPath || '',
            matchedAt: Date.now()
        };

        saveDownloadedMatches();
        log(`✅ Added track ${id} to no-duple list: ${filename}`);
        return true;
    };

    // Check if a track is already in downloaded matches
    const isTrackInDownloadedMatches = (trackId) => {
        return !!downloadedMatches[trackId];
    };

    // Check if a track matches by metadata (duration + filesize)
    const findMatchingDownloadedTrack = (durationSeconds, fileSizeKB, tolerance = { duration: 2, size: 10 }) => {
        for (const [id, match] of Object.entries(downloadedMatches)) {
            const durationMatch = match.durationSeconds &&
                Math.abs(match.durationSeconds - durationSeconds) <= tolerance.duration;
            const sizeMatch = match.fileSizeKB &&
                Math.abs(match.fileSizeKB - fileSizeKB) <= tolerance.size;

            // Both must match for a confident match
            if (durationMatch && sizeMatch) {
                return { id, match };
            }
        }
        return null;
    };

    // Remove a track from downloaded matches
    const removeFromDownloadedMatches = (trackId) => {
        if (downloadedMatches[trackId]) {
            delete downloadedMatches[trackId];
            saveDownloadedMatches();
            log(`🗑️ Removed track ${trackId} from no-duple list`);
            return true;
        }
        return false;
    };

    // Get downloaded matches count
    const getDownloadedMatchesCount = () => Object.keys(downloadedMatches).length;

    // Get all downloaded matches
    const getAllDownloadedMatches = () => ({ ...downloadedMatches });

    /**************************************************************
     *   DEDUPLICATION SYSTEM - Imported Files Cache
     **************************************************************/

    // In-memory cache of imported files with metadata
    let importedFilesCache = [];

    // Load imported files from GM storage
    const loadImportedFilesCache = () => {
        try {
            const stored = GM_getValue(GM_KEYS.importedFiles, '[]');
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                importedFilesCache = parsed;
                log(`📁 Loaded ${importedFilesCache.length} imported files from storage`);
            }
        } catch (e) {
            console.error('Failed to load imported files cache:', e);
            importedFilesCache = [];
        }
        return importedFilesCache;
    };

    // Save imported files to GM storage
    const saveImportedFilesCache = () => {
        try {
            GM_setValue(GM_KEYS.importedFiles, JSON.stringify(importedFilesCache));
        } catch (e) {
            console.error('Failed to save imported files cache:', e);
        }
    };

    // Add files to imported cache (with deduplication)
    const addToImportedFilesCache = (filesMetadata) => {
        const existingPaths = new Set(importedFilesCache.map(f => f.localPath || f.filename));
        let added = 0;

        for (const file of filesMetadata) {
            const key = file.localPath || file.filename;
            if (!existingPaths.has(key)) {
                importedFilesCache.push(file);
                existingPaths.add(key);
                added++;
            }
        }

        if (added > 0) {
            saveImportedFilesCache();
            log(`📁 Added ${added} new files to imported cache (total: ${importedFilesCache.length})`);
        }
        return added;
    };

    // Clear imported files cache
    const clearImportedFilesCache = () => {
        importedFilesCache = [];
        GM_deleteValue(GM_KEYS.importedFiles);
        log('🗑️ Cleared imported files cache');
    };

    /**************************************************************
     *   FETCH QUEUE SYSTEM - Persisted Queue Management
     **************************************************************/

    // In-memory queue state
    let fetchQueue = [];
    let queueSelection = new Set(); // Selected track IDs for multi-select
    let lastSelectedIndex = -1; // For shift-click range selection

    // Queue metadata (persistent metadata, process state now in bulkDownloaderState)
    let queueMeta = {
        lastFetchAt: null,
        totalFetched: 0,
        totalDownloaded: 0,
        fetchSource: '', // URL/page where fetched from
        get isFetching() { return bulkDownloaderState.isFetching && bulkDownloaderState.activeProcess === 'fetch'; },
        set isFetching(v) { if (v) { bulkDownloaderState.isFetching = true; bulkDownloaderState.activeProcess = 'fetch'; } else { bulkDownloaderState.isFetching = false; if (bulkDownloaderState.activeProcess === 'fetch') bulkDownloaderState.activeProcess = null; } },
        get isDownloading() { return bulkDownloaderState.isDownloading && bulkDownloaderState.activeProcess === 'download'; },
        set isDownloading(v) { if (v) { bulkDownloaderState.isDownloading = true; bulkDownloaderState.activeProcess = 'download'; } else { bulkDownloaderState.isDownloading = false; if (bulkDownloaderState.activeProcess === 'download') bulkDownloaderState.activeProcess = null; } },
        get fetchPaused() { return bulkDownloaderState.isPaused && bulkDownloaderState.activeProcess === 'fetch'; },
        set fetchPaused(v) { bulkDownloaderState.isPaused = v; },
        get downloadPaused() { return bulkDownloaderState.isPaused && bulkDownloaderState.activeProcess === 'download'; },
        set downloadPaused(v) { bulkDownloaderState.isPaused = v; },
        get activeProcess() { return bulkDownloaderState.activeProcess; },
        set activeProcess(v) { bulkDownloaderState.activeProcess = v; }
    };

    // Load fetch queue from GM storage
    const loadFetchQueue = () => {
        try {
            const stored = GM_getValue(GM_KEYS.fetchQueue, '[]');
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                fetchQueue = parsed;
                log(`📥 Loaded ${fetchQueue.length} tracks from fetch queue`);
            }

            // Load metadata
            const metaStored = GM_getValue(GM_KEYS.fetchQueueMeta, '{}');
            const metaParsed = JSON.parse(metaStored);
            if (typeof metaParsed === 'object') {
                queueMeta = { ...queueMeta, ...metaParsed };
            }

            // Restore bulk downloader state and clean up stuck processes
            restoreBulkDownloaderState();
        } catch (e) {
            console.error('Failed to load fetch queue:', e);
            fetchQueue = [];
        }
        return fetchQueue;
    };

    // Restore bulk downloader state on page load and clean up stuck processes
    const restoreBulkDownloaderState = () => {
        try {
            // Check if there's a stuck process (active process from previous session)
            // Since we can't reliably restore async processes, we'll mark them as stopped
            if (bulkDownloaderState.isFetching || bulkDownloaderState.isDownloading) {
                BulkLogger.warn('Detected stuck process from previous session - cleaning up');

                // Reset process state
                bulkDownloaderState.isFetching = false;
                bulkDownloaderState.isDownloading = false;
                bulkDownloaderState.isPaused = false;
                bulkDownloaderState.isStopped = true;
                bulkDownloaderState.activeProcess = null;

                // Clear any stuck UI states
                const queueOverlay = document.querySelector('.suno-modal-overlay[data-modal="queue"]');
                if (queueOverlay) {
                    // Hide progress section if stuck
                    const progressSection = document.getElementById('queue-modal-progress-section');
                    if (progressSection) {
                        progressSection.style.display = 'none';
                    }
                }

                // Hide progress card if stuck
                const card = document.querySelector('#suno-progress-card');
                if (card && card.classList.contains('bulk-downloader')) {
                    card.classList.remove('visible', 'running', 'paused');
                    card.classList.add('stopped');
                }

                // Reset performance mode
                setPerfMode(false);

                // Save cleaned state
                saveFetchQueue();

                BulkLogger.info('Stuck process cleaned up - you can resume from queue');
            }
        } catch (e) {
            console.error('Failed to restore bulk downloader state:', e);
        }
    };

    // Save fetch queue to GM storage
    const saveFetchQueue = () => {
        try {
            GM_setValue(GM_KEYS.fetchQueue, JSON.stringify(fetchQueue));
            GM_setValue(GM_KEYS.fetchQueueMeta, JSON.stringify(queueMeta));
        } catch (e) {
            console.error('Failed to save fetch queue:', e);
        }
    };

    // Add tracks to queue (merge with existing, avoid duplicates)
    const addToFetchQueue = (tracks, source = '') => {
        const existingIds = new Set(fetchQueue.map(t => t.id));
        let added = 0;

        for (const track of tracks) {
            if (!existingIds.has(track.id)) {
                // Check if track is a duplicate (downloaded matches/imported files)
                applyQueueDuplicateFlag(track);

                fetchQueue.push({
                    ...track,
                    isDuplicate: track.isDuplicate,
                    queueStatus: 'pending',
                    addedAt: Date.now()
                });
                existingIds.add(track.id);
                added++;
            }
        }

        if (added > 0) {
            queueMeta.lastFetchAt = Date.now();
            queueMeta.totalFetched += added;
            queueMeta.fetchSource = source || window.location.pathname;
            saveFetchQueue();
            log(`📥 Added ${added} tracks to queue (total: ${fetchQueue.length})`);
            updateQueueModalStats();
            updateQueueModalTabCounts();
        }

        return added;
    };

    // Remove tracks from queue by IDs
    const removeFromFetchQueue = (ids) => {
        const idsSet = new Set(ids);
        const before = fetchQueue.length;
        fetchQueue = fetchQueue.filter(t => !idsSet.has(t.id));
        const removed = before - fetchQueue.length;

        if (removed > 0) {
            // Also remove from selection
            ids.forEach(id => queueSelection.delete(id));
            saveFetchQueue();
            log(`🗑️ Removed ${removed} tracks from queue`);
        }

        return removed;
    };

    // Clear entire queue
    const clearFetchQueue = () => {
        fetchQueue = [];
        queueSelection.clear();
        lastSelectedIndex = -1;
        queueMeta = {
            lastFetchAt: null,
            totalFetched: 0,
            totalDownloaded: 0,
            fetchSource: '',
            isFetching: false,
            isDownloading: false,
            fetchPaused: false,
            downloadPaused: false,
            activeProcess: null
        };
        // Also clear bulk downloader state
        bulkDownloaderState.fetch.allSongs = new Map();
        bulkDownloaderState.fetch.processedPages = 0;
        bulkDownloaderState.fetch.titleCounts = {};
        bulkDownloaderState.fetch.seenUrls = new Set();
        saveFetchQueue();
        log('🗑️ Cleared fetch queue');

        // Update queue modal if visible
        const queueOverlay = document.querySelector('.suno-modal-overlay[data-modal="queue"]');
        if (queueOverlay && queueOverlay.classList.contains('visible')) {
            updateQueueModalTable();
            updateQueueModalStats();
            updateQueueModalTabCounts();
        }

        // Update bulk table if card is visible
        updateBulkTable();
    };

    // Update track status in queue
    const updateQueueTrackStatus = (id, status, extraData = {}) => {
        const track = fetchQueue.find(t => t.id === id);
        if (track) {
            track.queueStatus = status;
            Object.assign(track, extraData);
            applyQueueDuplicateFlag(track);
            saveFetchQueue();
            updateQueueModalStats();
            updateQueueModalTabCounts();
        }
    };

    // Get queue stats
    const getQueueStats = () => {
        const total = fetchQueue.length;
        const selected = queueSelection.size;
        const duplicates = fetchQueue.filter(t => t.isDuplicate).length;
        const pending = fetchQueue.filter(t => t.queueStatus === 'pending').length;
        const downloading = fetchQueue.filter(t => t.queueStatus === 'downloading').length;
        const completed = fetchQueue.filter(t => t.queueStatus === 'completed').length;
        const failed = fetchQueue.filter(t => t.queueStatus === 'failed').length;

        return { total, selected, duplicates, pending, downloading, completed, failed };
    };

    // Get filtered queue (for display)
    const getFilteredQueue = (filter = 'all', searchTerm = '') => {
        let result = [...fetchQueue];

        // Apply filter
        if (filter === 'pending') {
            result = result.filter(t => t.queueStatus === 'pending');
        } else if (filter === 'duplicates') {
            result = result.filter(t => t.isDuplicate);
        } else if (filter === 'completed') {
            result = result.filter(t => t.queueStatus === 'completed');
        } else if (filter === 'failed') {
            result = result.filter(t => t.queueStatus === 'failed');
        } else if (filter === 'selected') {
            result = result.filter(t => queueSelection.has(t.id));
        }

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(t =>
                (t.title || '').toLowerCase().includes(term) ||
                (t.rawTitle || '').toLowerCase().includes(term) ||
                (t.id || '').toLowerCase().includes(term) ||
                (t.tags || '').toLowerCase().includes(term) ||
                (t.prompt || '').toLowerCase().includes(term)
            );
        }

        return result;
    };

    // Selection helpers
    const selectQueueTrack = (id) => {
        queueSelection.add(id);
        updateSelectedActionsState();
    };

    const deselectQueueTrack = (id) => {
        queueSelection.delete(id);
        updateSelectedActionsState();
    };

    const toggleQueueTrackSelection = (id) => {
        if (queueSelection.has(id)) {
            queueSelection.delete(id);
        } else {
            queueSelection.add(id);
        }
        updateSelectedActionsState();
    };

    const selectAllQueueTracks = (trackIds = null) => {
        const ids = trackIds || fetchQueue.map(t => t.id);
        ids.forEach(id => queueSelection.add(id));
        updateSelectedActionsState();
    };

    const deselectAllQueueTracks = () => {
        queueSelection.clear();
        updateSelectedActionsState();
    };

    const removeSelectedQueueTracks = () => {
        const ids = Array.from(queueSelection);
        if (ids.length === 0) {
            toastManager.warning('No tracks selected');
            return;
        }
        removeFromFetchQueue(ids);
        deselectAllQueueTracks();
        updateQueueModalTable();
        updateQueueModalStats();
        updateQueueModalTabCounts();
        toastManager.info(`Removed ${ids.length} track(s) from queue`);
    };

    const refetchSelectedQueueTracks = () => {
        const ids = Array.from(queueSelection);
        if (ids.length === 0) {
            toastManager.warning('No tracks selected');
            return;
        }
        const songs = getSongsFromPage(fetchState.titleCounts || {}, fetchState.seenUrls || new Set());
        if (!songs || songs.length === 0) {
            toastManager.warning('No tracks found on this page to re-fetch.');
            return;
        }
        const map = new Map(songs.map(s => [s.id, s]));
        let updated = 0;
        ids.forEach(id => {
            const existing = fetchQueue.find(t => t.id === id);
            const fresh = map.get(id);
            if (existing && fresh) {
                Object.assign(existing, {
                    title: fresh.title || existing.title,
                    rawTitle: fresh.rawTitle || existing.rawTitle,
                    duration: fresh.duration || existing.duration,
                    durationSeconds: fresh.durationSeconds || existing.durationSeconds,
                    prompt: fresh.prompt || existing.prompt,
                    tags: fresh.tags || existing.tags,
                    modelVersion: fresh.modelVersion || existing.modelVersion,
                    workspaceName: fresh.workspaceName || existing.workspaceName,
                    createdAt: fresh.createdAt || existing.createdAt,
                    thumbnailUrl: fresh.thumbnailUrl || existing.thumbnailUrl,
                    url: fresh.url || existing.url,
                    queueStatus: existing.queueStatus || 'pending'
                });
                applyQueueDuplicateFlag(existing);
                updated++;
            }
        });
        if (updated > 0) {
            saveFetchQueue();
            updateQueueModalTable();
            updateQueueModalStats();
            updateQueueModalTabCounts();
            toastManager.success(`Updated ${updated} track(s) with fresh data`);
        } else {
            toastManager.info('No matching tracks were found to update.');
        }
    };

    const isQueueTrackSelected = (id) => queueSelection.has(id);

    // Range selection helper (for Shift+click)
    const selectQueueRange = (fromIndex, toIndex, trackIds) => {
        const start = Math.min(fromIndex, toIndex);
        const end = Math.max(fromIndex, toIndex);
        for (let i = start; i <= end; i++) {
            if (trackIds[i]) {
                queueSelection.add(trackIds[i]);
            }
        }
    };

    /**
     * Handle queue row selection with keyboard modifiers
     * @param {string} trackId - The track ID being selected
     * @param {number} rowIndex - The row index in the current filtered view
     * @param {MouseEvent} event - The click event (for modifier keys)
     */
    const handleQueueRowSelection = (trackId, rowIndex, event) => {
        const filteredTracks = getFilteredQueue('all', trackTableSearch);
        const trackIds = filteredTracks.map(t => t.id);

        if (event.shiftKey && lastSelectedIndex >= 0) {
            // Shift+click: Range selection
            if (event.ctrlKey || event.metaKey) {
                // Ctrl+Shift+click: Add range to existing selection
                selectQueueRange(lastSelectedIndex, rowIndex, trackIds);
            } else {
                // Shift+click only: Replace selection with range
                deselectAllQueueTracks();
                selectQueueRange(lastSelectedIndex, rowIndex, trackIds);
            }
        } else if (event.ctrlKey || event.metaKey) {
            // Ctrl+click: Toggle single item without affecting others
            toggleQueueTrackSelection(trackId);
            lastSelectedIndex = rowIndex;
        } else {
            // Regular click: Select only this item (deselect others)
            deselectAllQueueTracks();
            selectQueueTrack(trackId);
            lastSelectedIndex = rowIndex;
        }

        updateQueueSelectionUI();
        updateQueueTable();
    };

    /**************************************************************
     *   DOWNLOAD LOG - Track download history
     **************************************************************/

    // In-memory download log
    let downloadLog = [];

    // Load download log from GM storage
    const loadDownloadLog = () => {
        try {
            const stored = GM_getValue(GM_KEYS.downloadLog, '[]');
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                downloadLog = parsed;
                log(`📋 Loaded ${downloadLog.length} entries from download log`);
            }
        } catch (e) {
            console.error('Failed to load download log:', e);
            downloadLog = [];
        }
        return downloadLog;
    };

    // Save download log to GM storage
    const saveDownloadLog = () => {
        try {
            GM_setValue(GM_KEYS.downloadLog, JSON.stringify(downloadLog));
        } catch (e) {
            console.error('Failed to save download log:', e);
        }
    };

    // Add entry to download log
    const addToDownloadLog = (entry) => {
        downloadLog.push({
            id: entry.id,
            title: entry.title || entry.rawTitle,
            filename: entry.filename,
            url: entry.url,
            fileSize: entry.fileSize || null,
            downloadedAt: Date.now(),
            status: entry.status || 'completed',
            directory: 'Downloads' // Browser default, limited access
        });
        saveDownloadLog();
    };

    // Clear download log
    const clearDownloadLog = () => {
        downloadLog = [];
        GM_deleteValue(GM_KEYS.downloadLog);
        log('🗑️ Cleared download log');
    };

    /**************************************************************
     *   AUDIO METADATA EXTRACTION - Web Audio API
     **************************************************************/

    /**
     * Extract audio duration from a File object using Web Audio API
     * @param {File} file - Audio file
     * @returns {Promise<{duration: string, durationSeconds: number}>}
     */
    const extractAudioDuration = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const arrayBuffer = e.target.result;
                    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

                    const durationSeconds = audioBuffer.duration;
                    const minutes = Math.floor(durationSeconds / 60);
                    const seconds = Math.floor(durationSeconds % 60);
                    const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                    audioContext.close();
                    resolve({ duration, durationSeconds: Math.round(durationSeconds) });
                } catch (err) {
                    console.warn(`Failed to extract duration for ${file.name}:`, err);
                    resolve({ duration: null, durationSeconds: null });
                }
            };

            reader.onerror = () => {
                console.warn(`Failed to read file ${file.name}`);
                resolve({ duration: null, durationSeconds: null });
            };

            reader.readAsArrayBuffer(file);
        });
    };

    /**
     * Extract full metadata from audio files
     * @param {File[]} files - Array of audio files
     * @param {Function} onProgress - Optional progress callback (current, total)
     * @returns {Promise<Array>} Array of file metadata objects
     */
    const extractAudioFilesMetadata = async (files, onProgress = null) => {
        const results = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Extract duration using Web Audio API
            const { duration, durationSeconds } = await extractAudioDuration(file);

            // Build metadata object
            const metadata = {
                filename: file.name,
                filenameWithoutExt: file.name.replace(/\.(mp3|wav|m4a|flac|ogg)$/i, ''),
                normalized: normalizeFilenameForMatching(file.name),
                fileSize: file.size,
                fileSizeKB: Math.round(file.size / 1024),
                fileSizeMB: (file.size / (1024 * 1024)).toFixed(2),
                duration: duration,
                durationSeconds: durationSeconds,
                type: file.type || 'audio/*',
                lastModified: file.lastModified,
                // webkitRelativePath gives folder path when using webkitdirectory
                localPath: file.webkitRelativePath || file.name,
                importedAt: Date.now()
            };

            results.push(metadata);

            if (onProgress) {
                onProgress(i + 1, files.length, metadata);
            }
        }

        return results;
    };

    // Get download stats
    const getDownloadStats = () => {
        const automationCount = trackHistory.filter(t => t.source === 'automation').length;
        const bulkCount = trackHistory.filter(t => t.source === 'bulk').length;
        return {
            automationDownloaded: downloadedKeys.length,
            bulkDownloaded: fetchState.seenUrls.size,
            totalInHistory: trackHistory.length,
            automationInHistory: automationCount,
            bulkInHistory: bulkCount,
            // Deduplication stats
            downloadedMatches: getDownloadedMatchesCount(),
            importedFiles: importedFilesCache.length
        };
    };

    // Get all tracks for display (merged from history and current session)
    const getAllTracksForDisplay = (filter = 'all', searchTerm = '') => {
        // Merge current session tracks with history
        const allTracks = new Map();

        // Add history tracks first
        trackHistory.forEach(track => {
            allTracks.set(track.id, {
                ...track,
                inHistory: true,
                inSession: false
            });
        });

        // Overlay with current session tracks
        trackMetadata.forEach((track, id) => {
            const existing = allTracks.get(id) || {};
            allTracks.set(id, {
                ...existing,
                ...track,
                id: id,
                inSession: true,
                inHistory: existing.inHistory || false
            });
        });

        let result = Array.from(allTracks.values());

        // Apply filter
        if (filter === 'session') {
            result = result.filter(t => t.inSession);
        } else if (filter === 'history') {
            result = result.filter(t => t.inHistory && !t.inSession);
        } else if (filter === 'automation') {
            result = result.filter(t => t.source === 'automation');
        } else if (filter === 'bulk') {
            result = result.filter(t => t.source === 'bulk');
        }

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(t =>
                (t.title && t.title.toLowerCase().includes(term)) ||
                (t.id && t.id.toLowerCase().includes(term)) ||
                (t.styles && t.styles.toLowerCase().includes(term)) ||
                (t.name && t.name.toLowerCase().includes(term))
            );
        }

        // Sort by date (newest first)
        result.sort((a, b) => {
            const dateA = a.downloadedAt || a.timestamp || 0;
            const dateB = b.downloadedAt || b.timestamp || 0;
            return dateB - dateA;
        });

        return result;
    };

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const responsiveSleep = async (ms, activeCheck = () => true) => {
        const step = 200;
        const end = Date.now() + ms;
        while (Date.now() < end) {
            if (!activeCheck()) break;
            await sleep(Math.min(step, end - Date.now()));
        }
    };

    // Log function - writes to console and toolpanel log area
    const log = (...args) => {
        const message = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
        console.log('[SUNO-AUTO]', ...args);

        // Also log to toolpanel if it exists
        if (toolPanel && toolPanel.logArea) {
            // Determine log type from message content
            let type = 'info';
            if (message.includes('❌') || message.includes('error') || message.includes('Failed')) {
                type = 'error';
            } else if (message.includes('⚠️') || message.includes('warning')) {
                type = 'warning';
            } else if (message.includes('✅') || message.includes('✓') || message.includes('Success')) {
                type = 'success';
            }
            toolPanel.addLog(message, type);
        }
    };

    /**************************************************************
     *   BULK LOGGER - Centralized logging for bulk operations
     **************************************************************/

    const BulkLogger = {
        logs: [],
        debugMode: GM_getValue(GM_KEYS.bulkDebugMode, false),
        maxLogs: 1000,

        log(level, message, data = null) {
            const entry = {
                timestamp: Date.now(),
                level,
                message,
                data
            };

            this.logs.push(entry);
            if (this.logs.length > this.maxLogs) {
                this.logs.shift();
            }

            // Console output
            if (level === 'debug' && !this.debugMode) return;

            const consoleMethod = level === 'error' ? 'error' : 'log';
            const prefix = `[BULK-${level.toUpperCase()}]`;
            if (data) {
                console[consoleMethod](prefix, message, data);
            } else {
                console[consoleMethod](prefix, message);
            }

            // Update card log if visible
            this.updateCardLog(entry);

            // Also add to bulkDownloaderState logs
            bulkDownloaderState.logs.push(entry);
            if (bulkDownloaderState.logs.length > this.maxLogs) {
                bulkDownloaderState.logs.shift();
            }
        },

        debug(message, data = null) {
            this.log('debug', message, data);
        },

        info(message, data = null) {
            this.log('info', message, data);
        },

        warn(message, data = null) {
            this.log('warn', message, data);
        },

        error(message, data = null) {
            this.log('error', message, data);
        },

        updateCardLog(entry) {
            // Update card log display if card exists
            const card = document.querySelector('#suno-progress-card');
            if (!card || !card.classList.contains('bulk-downloader')) return;

            // Card log updates will be handled by updateProgressCard
            // This is a placeholder for future card log UI
        },

        setDebugMode(enabled) {
            this.debugMode = enabled;
            bulkDownloaderState.debugMode = enabled;
            GM_setValue(GM_KEYS.bulkDebugMode, enabled);
        },

        getLogs(level = null, limit = null) {
            let filtered = this.logs;
            if (level) {
                filtered = filtered.filter(e => e.level === level);
            }
            if (limit) {
                filtered = filtered.slice(-limit);
            }
            return filtered;
        },

        clear() {
            this.logs = [];
            bulkDownloaderState.logs = [];
        }
    };

    const randomDelay = (min, max) => min + Math.random() * (max - min);
    const visible = el => !!(el && el.offsetParent !== null && el.getClientRects().length);

    // URL helpers
    const isCreatePage = () => window.location.pathname.startsWith('/create');
    const isMePage = () => window.location.pathname.startsWith('/me');

    // SVG Icons (inline to avoid CSP issues)
    const ICONS = {
        play: '<svg viewBox="0 0 384 512"><path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.8 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>',
        stop: '<svg viewBox="0 0 384 512"><path fill="currentColor" d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/></svg>',
        pause: '<svg viewBox="0 0 320 512"><path fill="currentColor" d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>',
        check: '<svg viewBox="0 0 448 512"><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>',
        chartBar: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zm96 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32zm32 64H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 96H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>',
        download: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64z"/></svg>',
        cloudDownload: '<svg viewBox="0 0 640 512"><path fill="currentColor" d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-167l80 80c9.4 9.4 24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-39 39V184c0-13.3-10.7-24-24-24s-24 10.7-24 24V318.1l-39-39c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9z"/></svg>',
        copy: '<svg viewBox="0 0 448 512"><path fill="currentColor" d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/></svg>',
        eye: '<svg viewBox="0 0 576 512"><path fill="currentColor" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>',
        eyeSlash: '<svg viewBox="0 0 640 512"><path fill="currentColor" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>',
        fileExport: '<svg viewBox="0 0 576 512"><path fill="currentColor" d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V288H216c-13.3 0-24 10.7-24 24s10.7 24 24 24H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM384 336V288H494.1l-39-39c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l80 80c9.4 9.4 9.4 24.6 0 33.9l-80 80c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l39-39H384zm0-208H256V0L384 128z"/></svg>',
        layerGroup: '<svg viewBox="0 0 576 512"><path fill="currentColor" d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/></svg>',
        xmark: '<svg viewBox="0 0 384 512"><path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>',
        minus: '<svg viewBox="0 0 448 512"><path fill="currentColor" d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>',
        chartLine: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"/></svg>',
        music: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"/></svg>',
        trash: '<svg viewBox="0 0 448 512"><path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>',
        refresh: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/></svg>',
        info: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
        warning: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>',
        error: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>',
        success: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
        circle: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-352a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>',
        gear: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>',
        chevronUp: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>',
        chevronDown: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>',
        createMusic: '<svg viewBox="0 0 60 60"><path fill="currentColor" d="M22.9,17.6l-8.1,0.8c-1.5,0.1-2.6,1.4-2.6,2.8V46c-0.6-0.1-1.1-0.1-1.7-0.1c-4.7,0-8.6,3-8.6,6.8c0,3.7,3.8,6.8,8.6,6.8 c4.7,0,8.6-3,8.6-6.8V31.6l15.7-1.6c-0.1-0.2-0.2-0.4-0.3-0.6l-1.9-4.6l-4.6-1.9C25.7,22.1,23.8,20.1,22.9,17.6 M39.7,34.5v8.1 c-0.6-0.1-1.1-0.1-1.7-0.1c-4.7,0-8.6,3-8.6,6.8c0,3.8,3.8,6.8,8.6,6.8s8.6-3,8.6-6.8V34.5C44.4,35.3,41.9,35.4,39.7,34.5 M28.2,15.4c-0.1-1.4,0.8-2.8,2.1-3.3l5.5-2.2c0.9-0.3,1.5-1,1.9-1.9L40,2.6c1.2-2.8,5.2-2.8,6.3,0l2.2,5.5c0.3,0.8,1,1.5,1.9,1.9 l5.5,2.2c1.1,0.5,1.8,1.4,2,2.4c0.1,1.3-0.7,2.7-2.1,3.3L50.4,20c-0.9,0.3-1.5,1-1.9,1.9l-2.2,5.5c-1.2,2.8-5.2,2.8-6.4,0l-2.2-5.5 c-0.3-0.8-1-1.5-1.9-1.9l-5.5-2.2C29.2,17.4,28.5,16.5,28.2,15.4"/></svg>',
        search: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>',
        bolt: '<svg viewBox="0 0 448 512"><path fill="currentColor" d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z"/></svg>'
    };

    // Helper to enhance number inputs with custom increment/decrement buttons
    const enhanceNumberInput = (input) => {
        if (input.parentElement.classList.contains('suno-number-input-wrapper')) return input;

        const wrapper = document.createElement('div');
        wrapper.className = 'suno-number-input-wrapper';

        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        const controls = document.createElement('div');
        controls.className = 'suno-number-input-controls';

        const upBtn = document.createElement('button');
        upBtn.type = 'button';
        upBtn.className = 'suno-number-btn';
        upBtn.appendChild(createIcon('chevronUp', '10px'));
        upBtn.addEventListener('click', (e) => {
            e.preventDefault();
            input.stepUp();
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });

        const downBtn = document.createElement('button');
        downBtn.type = 'button';
        downBtn.className = 'suno-number-btn';
        downBtn.appendChild(createIcon('chevronDown', '10px'));
        downBtn.addEventListener('click', (e) => {
            e.preventDefault();
            input.stepDown();
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });

        controls.appendChild(upBtn);
        controls.appendChild(downBtn);
        wrapper.appendChild(controls);

        return wrapper;
    };

    // Custom createMusic icon data URI (from Suno's frontend)
    const CUSTOM_CREATE_MUSIC_ICON = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgNjAgNjAnPjxwYXRoIGZpbGw9J2N1cnJlbnRDb2xvcicgZD0nTTIyLjksMTcuNmwtOC4xLDAuOGMtMS41LDAuMS0yLjYsMS40LTIuNiwyLjhWNDZjLTAuNi0wLjEtMS4xLTAuMS0xLjctMC4xYy00LjcsMC04LjYsMy04LjYsNi44YzAsMy43LDMuOCw2LjgsOC42LDYuOCBjNC43LDAsOC42LTMsOC42LTYuOFYzMS42bDE1LjctMS42Yy0wLjEtMC4yLTAuMi0wLjQtMC4zLTAuNmwtMS45LTQuNmwtNC42LTEuOUMyNS43LDIyLjEsMjMuOCwyMC4xLDIyLjksMTcuNiBNMzkuNywzNC41djguMSBjLTAuNi0wLjEtMS4xLTAuMS0xLjctMC4xYy00LjcsMC04LjYsMy04LjYsNi44YzAsMy44LDMuOCw2LjgsOC42LDYuOHM4LjYtMyw4LjYtNi44VjM0LjVDNDQuNCwzNS4zLDQxLjksMzUuNCwzOS43LDM0LjUgTTI4LjIsMTUuNGMtMC4xLTEuNCwwLjgtMi44LDIuMS0zLjNsNS41LTIuMmMwLjktMC4zLDEuNS0xLDEuOS0xLjlMNDAsMi42YzEuMi0yLjgsNS4yLTIuOCw2LjMsMGwyLjIsNS41YzAuMywwLjgsMSwxLjUsMS45LDEuOSBsNS41LDIuMmMxLjEsMC41LDEuOCwxLjQsMiwyLjRjMC4xLDEuMy0wLjcsMi43LTIuMSwzLjNMNTAuNCwyMGMtMC45LDAuMy0xLjUsMS0xLjksMS45bC0yLjIsNS41Yy0xLjIsMi44LTUuMiwyLjgtNi40LDBsLTIuMi01LjUgYy0wLjMtMC44LTEtMS41LTEuOS0xLjlsLTUuNS0yLjJDMjkuMiwxNy40LDI4LjUsMTYuNSwyOC4yLDE1LjQnPjwvcGF0aD48L3N2Zz4=';

    // Valid Ionicons names set (from ionicons-icons-names.txt)
    // This is used for validation and autocomplete support
    const VALID_IONICONS_NAMES = new Set([
        'accessibility', 'accessibility-outline', 'accessibility-sharp', 'add', 'add-circle', 'add-circle-outline', 'add-circle-sharp', 'add-outline', 'add-sharp',
        'airplane', 'airplane-outline', 'airplane-sharp', 'alarm', 'alarm-outline', 'alarm-sharp', 'albums', 'albums-outline', 'albums-sharp',
        'alert', 'alert-circle', 'alert-circle-outline', 'alert-circle-sharp', 'alert-outline', 'alert-sharp', 'american-football', 'american-football-outline', 'american-football-sharp',
        'analytics', 'analytics-outline', 'analytics-sharp', 'aperture', 'aperture-outline', 'aperture-sharp', 'apps', 'apps-outline', 'apps-sharp',
        'archive', 'archive-outline', 'archive-sharp', 'arrow-back', 'arrow-back-circle', 'arrow-back-circle-outline', 'arrow-back-circle-sharp', 'arrow-back-outline', 'arrow-back-sharp',
        'arrow-down', 'arrow-down-circle', 'arrow-down-circle-outline', 'arrow-down-circle-sharp', 'arrow-down-outline', 'arrow-down-sharp',
        'arrow-forward', 'arrow-forward-circle', 'arrow-forward-circle-outline', 'arrow-forward-circle-sharp', 'arrow-forward-outline', 'arrow-forward-sharp',
        'arrow-redo', 'arrow-redo-circle', 'arrow-redo-circle-outline', 'arrow-redo-circle-sharp', 'arrow-redo-outline', 'arrow-redo-sharp',
        'arrow-undo', 'arrow-undo-circle', 'arrow-undo-circle-outline', 'arrow-undo-circle-sharp', 'arrow-undo-outline', 'arrow-undo-sharp',
        'arrow-up', 'arrow-up-circle', 'arrow-up-circle-outline', 'arrow-up-circle-sharp', 'arrow-up-outline', 'arrow-up-sharp',
        'at', 'at-circle', 'at-circle-outline', 'at-circle-sharp', 'at-outline', 'at-sharp', 'attach', 'attach-outline', 'attach-sharp',
        'backspace', 'backspace-outline', 'backspace-sharp', 'bag', 'bag-add', 'bag-add-outline', 'bag-add-sharp', 'bag-check', 'bag-check-outline', 'bag-check-sharp',
        'bag-handle', 'bag-handle-outline', 'bag-handle-sharp', 'bag-outline', 'bag-remove', 'bag-remove-outline', 'bag-remove-sharp', 'bag-sharp',
        'balloon', 'balloon-outline', 'balloon-sharp', 'ban', 'ban-outline', 'ban-sharp', 'bandage', 'bandage-outline', 'bandage-sharp',
        'bar-chart', 'bar-chart-outline', 'bar-chart-sharp', 'barbell', 'barbell-outline', 'barbell-sharp', 'barcode', 'barcode-outline', 'barcode-sharp',
        'baseball', 'baseball-outline', 'baseball-sharp', 'basket', 'basket-outline', 'basket-sharp', 'basketball', 'basketball-outline', 'basketball-sharp',
        'battery-charging', 'battery-charging-outline', 'battery-charging-sharp', 'battery-dead', 'battery-dead-outline', 'battery-dead-sharp',
        'battery-full', 'battery-full-outline', 'battery-full-sharp', 'battery-half', 'battery-half-outline', 'battery-half-sharp',
        'beaker', 'beaker-outline', 'beaker-sharp', 'bed', 'bed-outline', 'bed-sharp', 'beer', 'beer-outline', 'beer-sharp',
        'bicycle', 'bicycle-outline', 'bicycle-sharp', 'bluetooth', 'bluetooth-outline', 'bluetooth-sharp', 'boat', 'boat-outline', 'boat-sharp',
        'body', 'body-outline', 'body-sharp', 'bonfire', 'bonfire-outline', 'bonfire-sharp', 'book', 'book-outline', 'book-sharp',
        'bookmark', 'bookmark-outline', 'bookmark-sharp', 'bookmarks', 'bookmarks-outline', 'bookmarks-sharp',
        'bowling-ball', 'bowling-ball-outline', 'bowling-ball-sharp', 'briefcase', 'briefcase-outline', 'briefcase-sharp',
        'browsers', 'browsers-outline', 'browsers-sharp', 'brush', 'brush-outline', 'brush-sharp', 'bug', 'bug-outline', 'bug-sharp',
        'build', 'build-outline', 'build-sharp', 'bulb', 'bulb-outline', 'bulb-sharp', 'bus', 'bus-outline', 'bus-sharp',
        'business', 'business-outline', 'business-sharp', 'cafe', 'cafe-outline', 'cafe-sharp', 'calculator', 'calculator-outline', 'calculator-sharp',
        'calendar', 'calendar-clear', 'calendar-clear-outline', 'calendar-clear-sharp', 'calendar-number', 'calendar-number-outline', 'calendar-number-sharp',
        'calendar-outline', 'calendar-sharp', 'call', 'call-outline', 'call-sharp', 'camera', 'camera-outline', 'camera-reverse',
        'camera-reverse-outline', 'camera-reverse-sharp', 'camera-sharp', 'car', 'car-outline', 'car-sharp', 'car-sport', 'car-sport-outline', 'car-sport-sharp',
        'card', 'card-outline', 'card-sharp', 'caret-back', 'caret-back-circle', 'caret-back-circle-outline', 'caret-back-circle-sharp', 'caret-back-outline', 'caret-back-sharp',
        'caret-down', 'caret-down-circle', 'caret-down-circle-outline', 'caret-down-circle-sharp', 'caret-down-outline', 'caret-down-sharp',
        'caret-forward', 'caret-forward-circle', 'caret-forward-circle-outline', 'caret-forward-circle-sharp', 'caret-forward-outline', 'caret-forward-sharp',
        'caret-up', 'caret-up-circle', 'caret-up-circle-outline', 'caret-up-circle-sharp', 'caret-up-outline', 'caret-up-sharp',
        'cart', 'cart-outline', 'cart-sharp', 'cash', 'cash-outline', 'cash-sharp', 'cellular', 'cellular-outline', 'cellular-sharp',
        'chatbox', 'chatbox-ellipses', 'chatbox-ellipses-outline', 'chatbox-ellipses-sharp', 'chatbox-outline', 'chatbox-sharp',
        'chatbubble', 'chatbubble-ellipses', 'chatbubble-ellipses-outline', 'chatbubble-ellipses-sharp', 'chatbubble-outline', 'chatbubble-sharp',
        'chatbubbles', 'chatbubbles-outline', 'chatbubbles-sharp', 'checkbox', 'checkbox-outline', 'checkbox-sharp',
        'checkmark', 'checkmark-circle', 'checkmark-circle-outline', 'checkmark-circle-sharp', 'checkmark-done', 'checkmark-done-circle',
        'checkmark-done-circle-outline', 'checkmark-done-circle-sharp', 'checkmark-done-outline', 'checkmark-done-sharp', 'checkmark-outline', 'checkmark-sharp',
        'chevron-back', 'chevron-back-circle', 'chevron-back-circle-outline', 'chevron-back-circle-sharp', 'chevron-back-outline', 'chevron-back-sharp',
        'chevron-collapse', 'chevron-collapse-outline', 'chevron-collapse-sharp', 'chevron-down', 'chevron-down-circle',
        'chevron-down-circle-outline', 'chevron-down-circle-sharp', 'chevron-down-outline', 'chevron-down-sharp',
        'chevron-expand', 'chevron-expand-outline', 'chevron-expand-sharp', 'chevron-forward', 'chevron-forward-circle',
        'chevron-forward-circle-outline', 'chevron-forward-circle-sharp', 'chevron-forward-outline', 'chevron-forward-sharp',
        'chevron-up', 'chevron-up-circle', 'chevron-up-circle-outline', 'chevron-up-circle-sharp', 'chevron-up-outline', 'chevron-up-sharp',
        'clipboard', 'clipboard-outline', 'clipboard-sharp', 'close', 'close-circle', 'close-circle-outline', 'close-circle-sharp', 'close-outline', 'close-sharp',
        'cloud', 'cloud-circle', 'cloud-circle-outline', 'cloud-circle-sharp', 'cloud-done', 'cloud-done-outline', 'cloud-done-sharp',
        'cloud-download', 'cloud-download-outline', 'cloud-download-sharp', 'cloud-offline', 'cloud-offline-outline', 'cloud-offline-sharp',
        'cloud-outline', 'cloud-sharp', 'cloud-upload', 'cloud-upload-outline', 'cloud-upload-sharp', 'cloudy', 'cloudy-night',
        'cloudy-night-outline', 'cloudy-night-sharp', 'cloudy-outline', 'cloudy-sharp', 'code', 'code-download', 'code-download-outline', 'code-download-sharp',
        'code-outline', 'code-sharp', 'code-slash', 'code-slash-outline', 'code-slash-sharp', 'code-working', 'code-working-outline', 'code-working-sharp',
        'cog', 'cog-outline', 'cog-sharp', 'color-fill', 'color-fill-outline', 'color-fill-sharp', 'color-filter', 'color-filter-outline', 'color-filter-sharp',
        'color-palette', 'color-palette-outline', 'color-palette-sharp', 'color-wand', 'color-wand-outline', 'color-wand-sharp',
        'compass', 'compass-outline', 'compass-sharp', 'construct', 'construct-outline', 'construct-sharp', 'contract', 'contract-outline', 'contract-sharp',
        'contrast', 'contrast-outline', 'contrast-sharp', 'copy', 'copy-outline', 'copy-sharp', 'create', 'create-outline', 'create-sharp',
        'crop', 'crop-outline', 'crop-sharp', 'cube', 'cube-outline', 'cube-sharp', 'cut', 'cut-outline', 'cut-sharp',
        'desktop', 'desktop-outline', 'desktop-sharp', 'diamond', 'diamond-outline', 'diamond-sharp', 'dice', 'dice-outline', 'dice-sharp',
        'disc', 'disc-outline', 'disc-sharp', 'document', 'document-attach', 'document-attach-outline', 'document-attach-sharp',
        'document-lock', 'document-lock-outline', 'document-lock-sharp', 'document-outline', 'document-sharp', 'document-text',
        'document-text-outline', 'document-text-sharp', 'documents', 'documents-outline', 'documents-sharp', 'download', 'download-outline', 'download-sharp',
        'duplicate', 'duplicate-outline', 'duplicate-sharp', 'ear', 'ear-outline', 'ear-sharp', 'earth', 'earth-outline', 'earth-sharp',
        'easel', 'easel-outline', 'easel-sharp', 'egg', 'egg-outline', 'egg-sharp', 'ellipse', 'ellipse-outline', 'ellipse-sharp',
        'ellipsis-horizontal', 'ellipsis-horizontal-circle', 'ellipsis-horizontal-circle-outline', 'ellipsis-horizontal-circle-sharp',
        'ellipsis-horizontal-outline', 'ellipsis-horizontal-sharp', 'ellipsis-vertical', 'ellipsis-vertical-circle',
        'ellipsis-vertical-circle-outline', 'ellipsis-vertical-circle-sharp', 'ellipsis-vertical-outline', 'ellipsis-vertical-sharp',
        'enter', 'enter-outline', 'enter-sharp', 'exit', 'exit-outline', 'exit-sharp', 'expand', 'expand-outline', 'expand-sharp',
        'extension-puzzle', 'extension-puzzle-outline', 'extension-puzzle-sharp', 'eye', 'eye-off', 'eye-off-outline', 'eye-off-sharp', 'eye-outline', 'eye-sharp',
        'eyedrop', 'eyedrop-outline', 'eyedrop-sharp', 'fast-food', 'fast-food-outline', 'fast-food-sharp',
        'female', 'female-outline', 'female-sharp', 'file-tray', 'file-tray-full', 'file-tray-full-outline', 'file-tray-full-sharp',
        'file-tray-outline', 'file-tray-sharp', 'file-tray-stacked', 'file-tray-stacked-outline', 'file-tray-stacked-sharp',
        'film', 'film-outline', 'film-sharp', 'filter', 'filter-circle', 'filter-circle-outline', 'filter-circle-sharp', 'filter-outline', 'filter-sharp',
        'finger-print', 'finger-print-outline', 'finger-print-sharp', 'fish', 'fish-outline', 'fish-sharp',
        'fitness', 'fitness-outline', 'fitness-sharp', 'flag', 'flag-outline', 'flag-sharp', 'flame', 'flame-outline', 'flame-sharp',
        'flash', 'flash-off', 'flash-off-outline', 'flash-off-sharp', 'flash-outline', 'flash-sharp', 'flashlight', 'flashlight-outline', 'flashlight-sharp',
        'flask', 'flask-outline', 'flask-sharp', 'flower', 'flower-outline', 'flower-sharp', 'folder', 'folder-open',
        'folder-open-outline', 'folder-open-sharp', 'folder-outline', 'folder-sharp', 'football', 'football-outline', 'football-sharp',
        'footsteps', 'footsteps-outline', 'footsteps-sharp', 'funnel', 'funnel-outline', 'funnel-sharp',
        'game-controller', 'game-controller-outline', 'game-controller-sharp', 'gift', 'gift-outline', 'gift-sharp',
        'git-branch', 'git-branch-outline', 'git-branch-sharp', 'git-commit', 'git-commit-outline', 'git-commit-sharp',
        'git-compare', 'git-compare-outline', 'git-compare-sharp', 'git-merge', 'git-merge-outline', 'git-merge-sharp',
        'git-network', 'git-network-outline', 'git-network-sharp', 'git-pull-request', 'git-pull-request-outline', 'git-pull-request-sharp',
        'glasses', 'glasses-outline', 'glasses-sharp', 'globe', 'globe-outline', 'globe-sharp', 'golf', 'golf-outline', 'golf-sharp',
        'grid', 'grid-outline', 'grid-sharp', 'hammer', 'hammer-outline', 'hammer-sharp', 'hand-left', 'hand-left-outline', 'hand-left-sharp',
        'hand-right', 'hand-right-outline', 'hand-right-sharp', 'happy', 'happy-outline', 'happy-sharp',
        'hardware-chip', 'hardware-chip-outline', 'hardware-chip-sharp', 'headset', 'headset-outline', 'headset-sharp',
        'heart', 'heart-circle', 'heart-circle-outline', 'heart-circle-sharp', 'heart-dislike', 'heart-dislike-circle',
        'heart-dislike-circle-outline', 'heart-dislike-circle-sharp', 'heart-dislike-outline', 'heart-dislike-sharp',
        'heart-half', 'heart-half-outline', 'heart-half-sharp', 'heart-outline', 'heart-sharp', 'help', 'help-buoy',
        'help-buoy-outline', 'help-buoy-sharp', 'help-circle', 'help-circle-outline', 'help-circle-sharp', 'help-outline', 'help-sharp',
        'home', 'home-outline', 'home-sharp', 'hourglass', 'hourglass-outline', 'hourglass-sharp', 'ice-cream', 'ice-cream-outline', 'ice-cream-sharp',
        'id-card', 'id-card-outline', 'id-card-sharp', 'image', 'image-outline', 'image-sharp', 'images', 'images-outline', 'images-sharp',
        'infinite', 'infinite-outline', 'infinite-sharp', 'information', 'information-circle', 'information-circle-outline', 'information-circle-sharp',
        'information-outline', 'information-sharp', 'invert-mode', 'invert-mode-outline', 'invert-mode-sharp',
        'journal', 'journal-outline', 'journal-sharp', 'key', 'key-outline', 'key-sharp', 'keypad', 'keypad-outline', 'keypad-sharp',
        'language', 'language-outline', 'language-sharp', 'laptop', 'laptop-outline', 'laptop-sharp', 'layers', 'layers-outline', 'layers-sharp',
        'leaf', 'leaf-outline', 'leaf-sharp', 'library', 'library-outline', 'library-sharp', 'link', 'link-outline', 'link-sharp',
        'list', 'list-circle', 'list-circle-outline', 'list-circle-sharp', 'list-outline', 'list-sharp',
        'locate', 'locate-outline', 'locate-sharp', 'location', 'location-outline', 'location-sharp',
        'lock-closed', 'lock-closed-outline', 'lock-closed-sharp', 'lock-open', 'lock-open-outline', 'lock-open-sharp',
        'log-in', 'log-in-outline', 'log-in-sharp', 'log-out', 'log-out-outline', 'log-out-sharp',
        'logo-alipay', 'logo-amazon', 'logo-amplify', 'logo-android', 'logo-angular', 'logo-apple', 'logo-apple-appstore', 'logo-apple-ar',
        'logo-behance', 'logo-bitbucket', 'logo-bitcoin', 'logo-buffer', 'logo-capacitor', 'logo-chrome', 'logo-closed-captioning',
        'logo-codepen', 'logo-css3', 'logo-designernews', 'logo-deviantart', 'logo-discord', 'logo-docker', 'logo-dribbble', 'logo-dropbox',
        'logo-edge', 'logo-electron', 'logo-euro', 'logo-facebook', 'logo-figma', 'logo-firebase', 'logo-firefox', 'logo-flickr',
        'logo-foursquare', 'logo-github', 'logo-gitlab', 'logo-google', 'logo-google-playstore', 'logo-hackernews', 'logo-html5',
        'logo-instagram', 'logo-ionic', 'logo-ionitron', 'logo-javascript', 'logo-laravel', 'logo-linkedin', 'logo-markdown',
        'logo-mastodon', 'logo-medium', 'logo-microsoft', 'logo-no-smoking', 'logo-nodejs', 'logo-npm', 'logo-octocat', 'logo-paypal',
        'logo-pinterest', 'logo-playstation', 'logo-pwa', 'logo-python', 'logo-react', 'logo-reddit', 'logo-rss', 'logo-sass',
        'logo-skype', 'logo-slack', 'logo-snapchat', 'logo-soundcloud', 'logo-stackoverflow', 'logo-steam', 'logo-stencil',
        'logo-tableau', 'logo-tiktok', 'logo-tumblr', 'logo-tux', 'logo-twitch', 'logo-twitter', 'logo-usd', 'logo-venmo',
        'logo-vercel', 'logo-vimeo', 'logo-vk', 'logo-vue', 'logo-web-component', 'logo-wechat', 'logo-whatsapp', 'logo-windows',
        'logo-wordpress', 'logo-xbox', 'logo-xing', 'logo-yahoo', 'logo-yen', 'logo-youtube',
        'magnet', 'magnet-outline', 'magnet-sharp', 'mail', 'mail-open', 'mail-open-outline', 'mail-open-sharp',
        'mail-outline', 'mail-sharp', 'mail-unread', 'mail-unread-outline', 'mail-unread-sharp',
        'male', 'male-female', 'male-female-outline', 'male-female-sharp', 'male-outline', 'male-sharp',
        'man', 'man-outline', 'man-sharp', 'map', 'map-outline', 'map-sharp', 'medal', 'medal-outline', 'medal-sharp',
        'medical', 'medical-outline', 'medical-sharp', 'medkit', 'medkit-outline', 'medkit-sharp',
        'megaphone', 'megaphone-outline', 'megaphone-sharp', 'menu', 'menu-outline', 'menu-sharp',
        'mic', 'mic-circle', 'mic-circle-outline', 'mic-circle-sharp', 'mic-off', 'mic-off-circle',
        'mic-off-circle-outline', 'mic-off-circle-sharp', 'mic-off-outline', 'mic-off-sharp', 'mic-outline', 'mic-sharp',
        'moon', 'moon-outline', 'moon-sharp', 'move', 'move-outline', 'move-sharp',
        'musical-note', 'musical-note-outline', 'musical-note-sharp', 'musical-notes', 'musical-notes-outline', 'musical-notes-sharp',
        'navigate', 'navigate-circle', 'navigate-circle-outline', 'navigate-circle-sharp', 'navigate-outline', 'navigate-sharp',
        'newspaper', 'newspaper-outline', 'newspaper-sharp', 'notifications', 'notifications-circle',
        'notifications-circle-outline', 'notifications-circle-sharp', 'notifications-off', 'notifications-off-circle',
        'notifications-off-circle-outline', 'notifications-off-circle-sharp', 'notifications-off-outline', 'notifications-off-sharp',
        'notifications-outline', 'notifications-sharp', 'nuclear', 'nuclear-outline', 'nuclear-sharp',
        'nutrition', 'nutrition-outline', 'nutrition-sharp', 'open', 'open-outline', 'open-sharp',
        'options', 'options-outline', 'options-sharp', 'paper-plane', 'paper-plane-outline', 'paper-plane-sharp',
        'partly-sunny', 'partly-sunny-outline', 'partly-sunny-sharp', 'pause', 'pause-circle',
        'pause-circle-outline', 'pause-circle-sharp', 'pause-outline', 'pause-sharp', 'paw', 'paw-outline', 'paw-sharp',
        'pencil', 'pencil-outline', 'pencil-sharp', 'people', 'people-circle', 'people-circle-outline', 'people-circle-sharp',
        'people-outline', 'people-sharp', 'person', 'person-add', 'person-add-outline', 'person-add-sharp',
        'person-circle', 'person-circle-outline', 'person-circle-sharp', 'person-outline', 'person-remove',
        'person-remove-outline', 'person-remove-sharp', 'person-sharp', 'phone-landscape', 'phone-landscape-outline', 'phone-landscape-sharp',
        'phone-portrait', 'phone-portrait-outline', 'phone-portrait-sharp', 'pie-chart', 'pie-chart-outline', 'pie-chart-sharp',
        'pin', 'pin-outline', 'pin-sharp', 'pint', 'pint-outline', 'pint-sharp', 'pizza', 'pizza-outline', 'pizza-sharp',
        'planet', 'planet-outline', 'planet-sharp', 'play', 'play-back', 'play-back-circle',
        'play-back-circle-outline', 'play-back-circle-sharp', 'play-back-outline', 'play-back-sharp', 'play-circle',
        'play-circle-outline', 'play-circle-sharp', 'play-forward', 'play-forward-circle', 'play-forward-circle-outline',
        'play-forward-circle-sharp', 'play-forward-outline', 'play-forward-sharp', 'play-outline', 'play-sharp',
        'play-skip-back', 'play-skip-back-circle', 'play-skip-back-circle-outline', 'play-skip-back-circle-sharp',
        'play-skip-back-outline', 'play-skip-back-sharp', 'play-skip-forward', 'play-skip-forward-circle',
        'play-skip-forward-circle-outline', 'play-skip-forward-circle-sharp', 'play-skip-forward-outline', 'play-skip-forward-sharp',
        'podium', 'podium-outline', 'podium-sharp', 'power', 'power-outline', 'power-sharp',
        'pricetag', 'pricetag-outline', 'pricetag-sharp', 'pricetags', 'pricetags-outline', 'pricetags-sharp',
        'print', 'print-outline', 'print-sharp', 'prism', 'prism-outline', 'prism-sharp', 'pulse', 'pulse-outline', 'pulse-sharp',
        'push', 'push-outline', 'push-sharp', 'qr-code', 'qr-code-outline', 'qr-code-sharp',
        'radio', 'radio-button-off', 'radio-button-off-outline', 'radio-button-off-sharp',
        'radio-button-on', 'radio-button-on-outline', 'radio-button-on-sharp', 'radio-outline', 'radio-sharp',
        'rainy', 'rainy-outline', 'rainy-sharp', 'reader', 'reader-outline', 'reader-sharp',
        'receipt', 'receipt-outline', 'receipt-sharp', 'recording', 'recording-outline', 'recording-sharp',
        'refresh', 'refresh-circle', 'refresh-circle-outline', 'refresh-circle-sharp', 'refresh-outline', 'refresh-sharp',
        'reload', 'reload-circle', 'reload-circle-outline', 'reload-circle-sharp', 'reload-outline', 'reload-sharp',
        'remove', 'remove-circle', 'remove-circle-outline', 'remove-circle-sharp', 'remove-outline', 'remove-sharp',
        'reorder-four', 'reorder-four-outline', 'reorder-four-sharp', 'reorder-three', 'reorder-three-outline', 'reorder-three-sharp',
        'reorder-two', 'reorder-two-outline', 'reorder-two-sharp', 'repeat', 'repeat-outline', 'repeat-sharp',
        'resize', 'resize-outline', 'resize-sharp', 'restaurant', 'restaurant-outline', 'restaurant-sharp',
        'return-down-back', 'return-down-back-outline', 'return-down-back-sharp', 'return-down-forward',
        'return-down-forward-outline', 'return-down-forward-sharp', 'return-up-back', 'return-up-back-outline', 'return-up-back-sharp',
        'return-up-forward', 'return-up-forward-outline', 'return-up-forward-sharp', 'ribbon', 'ribbon-outline', 'ribbon-sharp',
        'rocket', 'rocket-outline', 'rocket-sharp', 'rose', 'rose-outline', 'rose-sharp',
        'sad', 'sad-outline', 'sad-sharp', 'save', 'save-outline', 'save-sharp', 'scale', 'scale-outline', 'scale-sharp',
        'scan', 'scan-circle', 'scan-circle-outline', 'scan-circle-sharp', 'scan-outline', 'scan-sharp',
        'school', 'school-outline', 'school-sharp', 'search', 'search-circle', 'search-circle-outline', 'search-circle-sharp',
        'search-outline', 'search-sharp', 'send', 'send-outline', 'send-sharp', 'server', 'server-outline', 'server-sharp',
        'settings', 'settings-outline', 'settings-sharp', 'shapes', 'shapes-outline', 'shapes-sharp',
        'share', 'share-outline', 'share-sharp', 'share-social', 'share-social-outline', 'share-social-sharp',
        'shield', 'shield-checkmark', 'shield-checkmark-outline', 'shield-checkmark-sharp', 'shield-half',
        'shield-half-outline', 'shield-half-sharp', 'shield-outline', 'shield-sharp', 'shirt', 'shirt-outline', 'shirt-sharp',
        'shuffle', 'shuffle-outline', 'shuffle-sharp', 'skull', 'skull-outline', 'skull-sharp',
        'snow', 'snow-outline', 'snow-sharp', 'sparkles', 'sparkles-outline', 'sparkles-sharp',
        'speedometer', 'speedometer-outline', 'speedometer-sharp', 'square', 'square-outline', 'square-sharp',
        'star', 'star-half', 'star-half-outline', 'star-half-sharp', 'star-outline', 'star-sharp',
        'stats-chart', 'stats-chart-outline', 'stats-chart-sharp', 'stop', 'stop-circle',
        'stop-circle-outline', 'stop-circle-sharp', 'stop-outline', 'stop-sharp', 'stopwatch', 'stopwatch-outline', 'stopwatch-sharp',
        'storefront', 'storefront-outline', 'storefront-sharp', 'subway', 'subway-outline', 'subway-sharp',
        'sunny', 'sunny-outline', 'sunny-sharp', 'swap-horizontal', 'swap-horizontal-outline', 'swap-horizontal-sharp',
        'swap-vertical', 'swap-vertical-outline', 'swap-vertical-sharp', 'sync', 'sync-circle',
        'sync-circle-outline', 'sync-circle-sharp', 'sync-outline', 'sync-sharp', 'tablet-landscape',
        'tablet-landscape-outline', 'tablet-landscape-sharp', 'tablet-portrait', 'tablet-portrait-outline', 'tablet-portrait-sharp',
        'telescope', 'telescope-outline', 'telescope-sharp', 'tennisball', 'tennisball-outline', 'tennisball-sharp',
        'terminal', 'terminal-outline', 'terminal-sharp', 'text', 'text-outline', 'text-sharp',
        'thermometer', 'thermometer-outline', 'thermometer-sharp', 'thumbs-down', 'thumbs-down-outline', 'thumbs-down-sharp',
        'thumbs-up', 'thumbs-up-outline', 'thumbs-up-sharp', 'thunderstorm', 'thunderstorm-outline', 'thunderstorm-sharp',
        'ticket', 'ticket-outline', 'ticket-sharp', 'time', 'time-outline', 'time-sharp',
        'timer', 'timer-outline', 'timer-sharp', 'today', 'today-outline', 'today-sharp',
        'toggle', 'toggle-outline', 'toggle-sharp', 'trail-sign', 'trail-sign-outline', 'trail-sign-sharp',
        'train', 'train-outline', 'train-sharp', 'transgender', 'transgender-outline', 'transgender-sharp',
        'trash', 'trash-bin', 'trash-bin-outline', 'trash-bin-sharp', 'trash-outline', 'trash-sharp',
        'trending-down', 'trending-down-outline', 'trending-down-sharp', 'trending-up', 'trending-up-outline', 'trending-up-sharp',
        'triangle', 'triangle-outline', 'triangle-sharp', 'trophy', 'trophy-outline', 'trophy-sharp',
        'tv', 'tv-outline', 'tv-sharp', 'umbrella', 'umbrella-outline', 'umbrella-sharp',
        'unlink', 'unlink-outline', 'unlink-sharp', 'videocam', 'videocam-off',
        'videocam-off-outline', 'videocam-off-sharp', 'videocam-outline', 'videocam-sharp',
        'volume-high', 'volume-high-outline', 'volume-high-sharp', 'volume-low', 'volume-low-outline', 'volume-low-sharp',
        'volume-medium', 'volume-medium-outline', 'volume-medium-sharp', 'volume-mute',
        'volume-mute-outline', 'volume-mute-sharp', 'volume-off', 'volume-off-outline', 'volume-off-sharp',
        'walk', 'walk-outline', 'walk-sharp', 'wallet', 'wallet-outline', 'wallet-sharp',
        'warning', 'warning-outline', 'warning-sharp', 'watch', 'watch-outline', 'watch-sharp',
        'water', 'water-outline', 'water-sharp', 'wifi', 'wifi-outline', 'wifi-sharp',
        'wine', 'wine-outline', 'wine-sharp', 'woman', 'woman-outline', 'woman-sharp'
    ]);

    // Create icon element - prioritizes Ionicons names directly, then mapping, then SVG fallback
    // Special case: 'createMusic' uses custom icon via data URI in Ionicons
    const createIcon = (iconName, size = null, forceSVG = false) => {
        if (!iconName) {
            // Return empty span if no icon name provided
            const span = document.createElement('span');
            span.className = 'suno-icon';
            return span;
        }

        // Special handling for createMusic - use custom icon with data URI
        if (iconName === 'createMusic') {
            const icon = document.createElement('ion-icon');
            icon.setAttribute('src', CUSTOM_CREATE_MUSIC_ICON);
            icon.className = 'suno-icon';
            if (size) {
                icon.style.fontSize = size;
            }
            icon.setAttribute('aria-hidden', 'true');
            return icon;
        }

        // Step 1: Try using iconName directly as Ionicons name (if it's a valid Ionicons name)
        if (VALID_IONICONS_NAMES.has(iconName)) {
            const icon = document.createElement('ion-icon');
            icon.setAttribute('name', iconName);
            icon.className = 'suno-icon';
            if (size) {
                icon.style.fontSize = size;
            }
            icon.setAttribute('aria-hidden', 'true');
            return icon;
        }

        // Step 2: Try mapping (for backward compatibility with old icon names)
        const mappedIconName = IONICONS_MAP[iconName];
        if (mappedIconName && VALID_IONICONS_NAMES.has(mappedIconName)) {
            const icon = document.createElement('ion-icon');
            icon.setAttribute('name', mappedIconName);
            icon.className = 'suno-icon';
            if (size) {
                icon.style.fontSize = size;
            }
            icon.setAttribute('aria-hidden', 'true');
            return icon;
        }

        // Step 3: Fallback to SVG (for legacy icons not in Ionicons)
        if (!forceSVG && ICONS[iconName]) {
            const span = document.createElement('span');
            span.className = 'suno-icon';
            if (size) {
                span.style.setProperty('--suno-icon-size', size);
            }
            const svgString = ICONS[iconName];
            if (svgString) {
                const template = document.createElement('template');
                template.innerHTML = svgString.trim();
                const svg = template.content.firstChild;
                if (svg) {
                    span.appendChild(svg);
                }
            }
            return span;
        }

        // Final fallback: empty icon or circle
        const span = document.createElement('span');
        span.className = 'suno-icon';
        if (size) {
            span.style.setProperty('--suno-icon-size', size);
        }
        const svgString = ICONS.circle || '';
        if (svgString) {
            const template = document.createElement('template');
            template.innerHTML = svgString.trim();
            const svg = template.content.firstChild;
            if (svg) {
                span.appendChild(svg);
            }
        }
        return span;
    };

    // Update icon in element
    const updateIcon = (element, iconName) => {
        const iconSpan = element.querySelector('.suno-icon');
        if (iconSpan) {
            const newIcon = createIcon(iconName);
            iconSpan.replaceWith(newIcon);
        }
    };

    // Get default icon for button text (for buttons without explicit icons)
    // Returns Ionicons names directly
    const getDefaultButtonIcon = (text) => {
        const textLower = text.toLowerCase();
        if (textLower.includes('clear') || textLower.includes('delete') || textLower.includes('remove')) return 'trash';
        if (textLower.includes('export') || textLower.includes('save') || textLower.includes('download')) return 'download';
        if (textLower.includes('refresh') || textLower.includes('reload')) return 'refresh';
        if (textLower.includes('close') || textLower.includes('cancel')) return 'close';
        if (textLower.includes('settings') || textLower.includes('config')) return 'settings';
        if (textLower.includes('automation')) return 'flash';
        if (textLower.includes('bulk')) return 'cloud-download';
        if (textLower.includes('start') || textLower.includes('play')) return 'createMusic'; // Start button uses createMusic icon
        if (textLower.includes('stop')) return 'stop';
        if (textLower.includes('pause')) return 'pause';
        if (textLower.includes('resume')) return 'play';
        if (textLower.includes('copy')) return 'copy';
        if (textLower.includes('search') || textLower.includes('find')) return 'search';
        if (textLower.includes('info') || textLower.includes('information')) return 'information-circle';
        if (textLower.includes('warning') || textLower.includes('alert')) return 'warning';
        if (textLower.includes('error') || textLower.includes('fail')) return 'close-circle';
        if (textLower.includes('success') || textLower.includes('complete')) return 'checkmark-circle';
        return null; // No default icon
    };

    /**************************************************************
     *   CSS VARIABLES & STYLES - COMPREHENSIVE THEME SYSTEM
     **************************************************************/
    GM_addStyle(`
            /* partially moved to the file userscript_suno_styles.css*/
            .suno-queue-status.unique {
                --suno-accent-color: var(--suno-secondary, #4b21a2);
            }
            .suno-queue-status {
                font-size: 10px !important;
                font-weight: 600!important;
                display: inline-flex;
                text-transform: uppercase;
                padding: 4px 8px;
                border-radius: 40px;
                position: relative;
                color: var(--suno-primary);
                outline-offset: 1px;
                height: 20px;
                min-height: 20px;
                max-height: 20px;
                line-height: 1rem;
                width: -webkit-fill-available;
                cursor: pointer;
                outline: var(--suno-accent-color-border) solid 1px;
                --suno-accent-color: var(--suno-primary);
                --suno-accent-color-border: color-mix(in srgb, var(--suno-accent-color) 86%, transparent);
                --suno-accent-color-bg: color-mix(in srgb, var(--suno-accent-color) 30%, transparent);
                background: var(--suno-accent-color-bg);
                --suno-accent-color-text: color-mix(in srgb, var(--suno-accent-color) 55%, #ffffff);
                color: var(--suno-accent-color-text);
                flex-direction: row;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: center;
            }
            tr:hover .suno-queue-status {

                --suno-accent-color-bg: color-mix(in srgb, var(--suno-accent-color) 100%, transparent);
                background: var(--suno-accent-color-bg);

            }
            td:hover .suno-queue-status {

                --suno-accent-color-border: color-mix(in srgb, var(--suno-accent-color) 76%, #ffffff);
                --suno-accent-color-bg: color-mix(in srgb, var(--suno-accent-color) 98%, transparent);
                background: var(--suno-accent-color-bg);
                --suno-accent-color-text: color-mix(in srgb, var(--suno-accent-color) 5%, white);
                color: var(--suno-accent-color-text);
                    outline: var(--suno-accent-color-border) solid 1px;

            }
            .suno-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0px;
            }
            #suno-progress-card.bulk-downloader .suno-table td:last-child {
                max-width: 21ch!important;
                font-size: 11px!important;
            }
            #suno-progress-card .suno-bulk-progress {
                gap: var(--suno-spacing-sm) !important;
                padding: var(--suno-spacing-mds,0) 0 0 12px !important;
                background: var(--suno-accent-color-bg) !important;
                display: flex;
                border-top: 1px solid;
                border-bottom: 1px solid;
                border-color: var(--suno-accent-color-border);
                flex-direction: row;
                flex-wrap: nowrap;
                flex: 1 1 100%;
                width: -webkit-fill-available;
                font-family: var(--suno-font-family-mono);
                font-size: 11px;
                line-height: 1.25em;
                color: var(--suno-text-secondary);
                text-wrap-style: pretty;
                align-items: center;
            }
            #suno-progress-card.bulk-downloader .suno-table td:last-child {
                max-width: 21ch!important;
                font-size: 11px!important;
            }

            #suno-progress-card .suno-bulk-progress button.suno-panel-btn {

                margin-left: auto;
                background: transparent;
                aspect-ratio: unset;
                padding: 0;
                border-radius: 0;
                width: calc(var(--suno-btn-icon-minsize)/1.2);
                min-width: calc(var(--suno-btn-icon-minsize)/1.2);
                height: 100%;
                border: none;
                border-left: 1px solid var(--suno-border-default);
                color: var(--suno-panel-color);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                max-height: unset;
                min-height: -webkit-fill-available;
            }


            #suno-progress-card span.progress-label {
                padding: var(--suno-spacing-md) 0;
            }
            #suno-progress-card .suno-bulk-table-scroll {
                padding: 0;
                overflow-y: auto;
                border: none;
                max-height: 300px;
                flex: 1 1 100%;
                scrollbar-width: thin;
                overflow-x: hidden;
                border-collapse: collapse!important;
                scrollbar-color: #898989 transparent !important;
            }
            #suno-progress-card .suno-bulk-table {
                width: 100% !important;
                border-collapse: separate!important;
                font-family: var(--suno-font-family-mono);
                font-size: 11px;
            }
            #suno-progress-card.docked {
                position: relative;
                right: auto;
                bottom: auto;
                width: 100%;
                box-shadow: none;
                margin: 0!important;
            }
            #suno-panel.minimized {
                height: var(--suno-btn-height) !important;
                min-height: unset !important;
                max-height: var(--suno-btn-height) !important;
                resize: none;
                overflow: hidden!important;
                --suno-header-border: var(--suno-panel-border);
                --suno-btn-disabled-border:var(--suno-panel-border-2);
                --suno-panel-border-2: var(--suno-panel-border) ;
            }
            #suno-panel.minimized:hover .suno-panel-header,#suno-panel.minimized:hover{
                --suno-header-bg: var(--suno-panel-bg-3);
                --suno-ui-bg-overlay: var(--suno-header-bg);
                --suno-panel-border: var(--suno-ui-border-light);

            }
            #suno-panel.minimized .suno-panel-header {
                height: var(--suno-btn-height);
                min-height: var(--suno-btn-height) !important;
                max-height: var(--suno-btn-height) !important;
                border: none;
            }
            #suno-panel.layout_two .suno-button-row.title#suno-bulk-progress {
                gap: 10px!important;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                align-items: center;
                padding-left: 10px!important;
                max-height: var(--suno-btn-size);
                height: var(--suno-btn-size);
                min-height: unset;
                font-size: 12px;
            }
            #suno-panel.layout_two .suno-bulk-progress span.progress-label {
                padding: var(--suno-spacing-md) 0;
                font-size: 12px;
                font-family: var(--suno-font-family-mono);
            }
            #suno-panel .suno-panel-log-wrapper {
                min-height: 130px;
            }
            details.suno-modal-instructions:open {
                cursor: default;
                --suno-accent-color: var(--suno-secondary);
            }

            .suno-modal-instructions ol li::marker, .suno-modal-instructions ul li::marker, .suno-modal-instructions ul li::before {
                color: var(--suno-accent-color);
                filter: brightness(1.2);
                left: 0;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
            }
            .suno-modal-instructions summary:has(ion-icon)::before {
                align-content: center;
                align-items: center;
                border-right: 1px solid var(--suno-panel-border);
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
                justify-content: center;
                left: 0;
                margin: 0;
                position: absolute;
                top: 0;
                width: calc(var(--suno-btn-icon-minsize)/1);
                height: 100%;
                content: "";
                background: currentColor;
                mask: var(--mask) no-repeat center center / calc(var(--suno-btn-icon-size)/0.7);
            }
            .suno-modal-instructions:open summary:has(ion-icon) {
                --suno-accent-color: white;
                align-items: center;
                /* background: #0000004a; */
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                gap: 2px;
                left: 0;
                padding: 0px 10px 0px calc(var(--suno-btn-icon-minsize)/1);
                position: absolute;
                top: 0;
                width: -webkit-fill-available;
                height: var(--suno-btn-size);
                justify-content: space-between;
                line-height: var(--suno-btn-size);
                font-size: var(--suno-font-size);
            }
            .suno-modal-instructions summary:has(ion-icon)>ion-icon {
                font-size: 10px !important;
                text-align: center;
                width: calc(var(--suno-btn-icon-minsize)/2);
                --suno-icon-size: 16px;
                height: calc(var(--suno-btn-icon-minsize)/1);
                border-left: 1px solid #ffffff1a;
                padding: 0 8px;
            }
            .suno-modal-instructions summary:has(ion-icon):hover, details.suno-modal-instructions:open summary:has(ion-icon) {
                --suno-accent-color: white;
                accent-color: white;
                background-color: var(--suno-secondary);
            }
           .suno-modal-instructions:open {
                background: var(--suno-panel-bg-2);
                background: var(--suno-bg-primary);
                background: var(--suno-header-bg);
                background: #121212;
                color: var(--suno-panel-color);
                cursor: initial;
                display: flex;
                padding: 18px;
            }
            .suno-modal-instructions:open:has(summary > ion-icon) {
                /* overflow: hidden; */
                padding-top: calc(var(--suno-btn-icon-minsize) + 18px);
                position: relative;
            }
            .suno-modal-actions:has(.suno-modal-actions-left:empty):has(.suno-modal-actions-right:empty) {
                display: none;
            }
            .suno-help-accordion-container:has(details.suno-modal-instructions:open:only-child) summary {
                pointer-events: none;
            }
            #suno-panel.layout_two:not(:has(.suno-bulk-content.open)) .suno-panel-log-wrapper {
                flex: 1;
                height: auto;
                max-height: unset;
            }
            #suno-panel.layout_two #suno-bulk-controls .suno-button-row.title#suno-bulk-progress button.suno-panel-btn {
                visibility: hidden;
            }
            #suno-progress-card .suno-bulk-table td:first-child, #suno-progress-card .suno-bulk-table th:first-child {
                flex: 1 1 20%;
                width: 50px!important;
                max-width: 50px!important;
                text-align: center;
            }
            .suno-panel-header-btn, .suno-progress-header .suno-progress-btn {
                min-width: calc(var(--suno-btn-icon-minsize)/1.2);
                height: 100%;
                width: calc(var(--suno-btn-icon-minsize)/1.2);
                border: 1px solid var(--suno-btn-disabled-border);
                border-width: 0;
                background: transparent;
                border-radius: 0;
                color: var(--suno-btn-disabled-color);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 300ms, color 300ms, border-color 300ms;
                flex-direction: column;
                flex-wrap: wrap;
                align-content: stretch;
                padding: var(--suno-btn-gap);
                aspect-ratio: 1;
                appearance: none;
                flex: 1;
                overflow: hidden;
                --suno-btn-disabled-border: #3f3f3f2b;
            }
            .suno-progress-card .suno-progress-controls .suno-progress-btn {
                height: 100%;
                border: 0px solid var(--suno-btn-disabled-border);
                border-radius: 0;
                width: calc(var(--suno-btn-height)/1.8);
                border-left-width: 1px;
            }
            #suno-panel.layout_two #suno-bulk-controls, #suno-panel.layout_two #suno-bulk-controls:not(.open) {
                display: flex!important;
                justify-content: flex-start;
                flex-direction: column;
                flex-wrap: nowrap;
                align-items: stretch;
                overflow: hidden;
                max-height: fit-content;
            }
            #suno-panel.layout_two:not(:has(.suno-bulk-content.open)) .suno-panel-log-wrapper {
                flex: 0 1 auto;
                height: fit-content;
                max-height: fit-content;
            }
            .suno-panel-header-btn:not(:last-child) {
                border-right-width: 1px;
                --suno-btn-disabled-border: var(--suno-panel-border-2);
            }

            .suno-modal-title h3 ion-icon.suno-icon {
                --suno-icon-size: 20px!important;

                flex: 0;
                width: var(--suno-icon-size) !important;
                height: var(--suno-icon-size) !important;
                max-width: var(--suno-icon-size) !important;
                max-height: var(--suno-icon-size) !important;
                min-width: var(--suno-icon-size) !important;
                min-height: var(--suno-icon-size) !important;
                display: grid !important;
                align-items: center;
                place-content: center;
                align-content: center;
                aspect-ratio: 1;
                margin: 0;
                padding: 0;
                vertical-align: middle;
            }
            /*
            .suno-modal-instructions h3, .suno-modal-instructions h4, .suno-modal-instructions h5 {
                align-items: center;
                background: transparent;
                border: none;
                border-bottom: 1px solid var(--suno-panel-border);
                border-radius: var(--suno-border-radius);
                border-radius: 0;
                font-weight: 500;
                margin-top: 0.15em;
                margin-bottom: 0.5em;
                padding: 0.5em 0 0.5em 0;
                position: relative;
                line-height: 1;
            }
            */
            [class*="suno-"], [id*="suno-"]{
                h3{
                    font-size: 1em;
                font-family: var(--suno-font-family);

                }
                h4{
                    font-size: 0.98em;
                font-family: var(--suno-font-family);

                }
                h5{
                    font-size: 0.8em;
                    font-family: var(--suno-font-family);

                }
            }
            [class*="suno-"] *:focus-visible,[class*="suno-"] *:focus-within,[class*="suno-"] *:focus,[class*="suno-"] *:active{
                outline: none!important;
            }
            .suno-modal-instructions ol, .suno-modal-instructions ul {
                align-content: stretch;
                align-items: stretch;
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
                font-size: inherit;
                gap: 7px;
                line-height: 1.75em;
                margin: 0px 0 6px 0;
                padding-left: 0;
                    font-size: var(--suno-font-size-sm);

            }

            /* =========================================================
            SUNO MODAL INSTRUCTIONS — SMART HEADING LOGIC
            ========================================================= */
            .suno-modal-instructions *:not(summary){
                --suno-accent-color: var(--suno-accent-color-bg);
                font-family: var(--suno-font-family-mono);
                font-size: var(--suno-font-size-sm);
            }
            /* Base shared heading styles */
            .suno-modal-instructions :is(h3, h4, h5) {
                align-items: center;
                background: transparent;
                border: none;
                border-bottom: 1px solid var(--suno-panel-border);
                border-radius: 0;
                font-weight: 300;
                margin-top: var(--suno-spacing-xs);
                margin-bottom: var(--suno-spacing-xs);
                padding: var(--suno-spacing-sm) 0;
                position: relative;
                line-height: 1;
                font-family: var(--suno-font-family);
                letter-spacing: 0.04rem;
                color: var(--suno-panel-color);
            }

            /* ---------------------------------------------------------
            CASE 1: h3 is the first heading → main title
            --------------------------------------------------------- */
            .suno-modal-instructions > h3:first-child {
                font-size: 1.5em;
                border-left: 3px solid var(--suno-accent-color);
                padding-left:var(--suno-spacing-md);
                border-bottom-width: 0px;
            }
            .suno-modal-instructions.suno-help-intro {
                padding: calc(var(--suno-panel-padding));
                --suno-accent-color: var(--suno-primary);
                --suno-accent-color-bg: var(--suno-accent-color);
            }


            /* ---------------------------------------------------------
            CASE 2: no h3, first heading is h4 → promote h4
            --------------------------------------------------------- */
            .suno-modal-instructions:not(:has(> h3)) > h4:first-child {
                font-size: 1.2em;
            }

            /* ---------------------------------------------------------
            CASE 3: no h3 AND h4 is NOT the first heading
            → h4s are subsection titles (smaller)
            --------------------------------------------------------- */
            .suno-modal-instructions:not(:has(> h3)):not(:has(> h4:first-child)) h4 {
                font-size: 0.9em;
                font-weight: 800;
            }

            /* ---------------------------------------------------------
            Default hierarchy tuning
            --------------------------------------------------------- */
            .suno-modal-instructions h4 {
                font-size: 1em;
            }

            .suno-modal-instructions h5 {
                font-size: 0.85em;
            }


            .suno-modal-instructions summary:has(ion-icon):hover, details.suno-modal-instructions:open summary:has(ion-icon){
                border-radius: calc(var(--suno-border-radius) - 1px)!important;

            }
            details.suno-modal-instructions:open summary:has(ion-icon){
                border-bottom-left-radius:0!important;
                border-bottom-right-radius:0!important;

            }
            .suno-modal-instructions summary{
                outline: none!important;

            }

            details.suno-modal-instructions:nth-child(odd), details.suno-modal-instructions:nth-child(odd) summary{
                --suno-accent-color-bg: var(--suno-primary);
            }
            details.suno-modal-instructions:nth-child(even), details.suno-modal-instructions:nth-child(even) summary{
                --suno-accent-color-bg: var(--suno-secondary);
            }

            details.suno-modal-instructions summary:hover, .suno-modal-instructions summary:has(ion-icon):hover, details.suno-modal-instructions:open summary:has(ion-icon){
                background-color: var(--suno-accent-color-bg);
            }
            .suno-modal-instructions:open summary {
                border-bottom: 0px solid var(--suno-panel-border);
                margin-bottom: 0px;
                padding-bottom: 11px;
            }
            #suno-modal-overlay .suno-modal-instructions summary:has(ion-icon) {
                padding-left: calc(var(--suno-btn-icon-minsize) + 0px)!important;
                min-height: calc(var(--suno-btn-icon-minsize) - 0px);
            }
            .suno-table thead th, .suno-table tbody tr {
                /* border-right: 1px solid rgb(59 59 59); */
                border-color: var(--suno-panel-border-2) !important;
                border-collapse: separate;
                border-bottom: 0px solid var(--suno-panel-border-2);
            }
            `);

    /**************************************************************
     *   SMART BUTTON CLASS
     **************************************************************/
    class SunoSmartButton {
        constructor(config) {
            this.id = config.id;
            this.text = config.text || '';
            this.icon = config.icon || '';
            this.classes = Array.isArray(config.classes) ? config.classes : (config.classes ? [config.classes] : ['suno-btn']);
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

            // Always add icon - use provided icon or default based on text
            let iconToUse = this.icon;
            if (!iconToUse && this.text) {
                iconToUse = getDefaultButtonIcon(this.text);
            }

            if (iconToUse) {
                const iconEl = createIcon(iconToUse);
                button.appendChild(iconEl);
            }

            const textSpan = document.createElement('span');
            textSpan.className = 'suno-btn-text';
            if (this.text) {
                textSpan.textContent = this.text.trim();
            }
            button.appendChild(textSpan);

            if (this.showCounter) {
                this.counterElement = document.createElement('span');
                this.counterElement.className = 'suno-button-counter';
                button.appendChild(this.counterElement);
            }

            if (this.tooltip) {
                button.setAttribute('data-tooltip', this.tooltip);
            }

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
                const iconEl = this.element.querySelector('.suno-icon');
                if (iconEl) {
                    const newIcon = createIcon(stateConfig.icon);
                    iconEl.replaceWith(newIcon);
                } else if (this.element.firstChild) {
                    const newIcon = createIcon(stateConfig.icon);
                    this.element.insertBefore(newIcon, this.element.firstChild);
                }
            }

            if (stateConfig.text !== undefined) {
                const textSpan = this.element.querySelector('.suno-btn-text');
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
            const textSpan = this.element.querySelector('span:not(.suno-button-counter)');
            if (textSpan) {
                textSpan.textContent = text ? text.trim() : '';
            }
        }
        setIcon(iconName) {
            const iconEl = this.element.querySelector('.suno-icon');
            const newIcon = createIcon(iconName);
            if (iconEl) {
                iconEl.replaceWith(newIcon);
            } else {
                this.element.insertBefore(newIcon, this.element.firstChild);
            }
        }
    }

    function createSmartButton(config) {
        return new SunoSmartButton(config);
    }

    /**************************************************************
     *   TOOLTIP CONFIGURATION SYSTEM
     **************************************************************/

    // Centralized tooltip configuration for buttons and common UI elements
    const TOOLTIP_CONFIG = {
        // Modal controls
        'suno-toggle-optional': 'Show/Hide optional columns (ID, Styles, Initial Text, Settings)',
        'suno-track-search-input': 'Search tracks by name, ID, or styles',

        // Common button tooltips by text content
        'close': 'Close this modal',
        'cancel': 'Cancel and close',
        'refresh': 'Refresh the data',
        'export': 'Export data to file',
        'clear': 'Clear all data',
        'check duplicates': 'Check for duplicate tracks',
        'export csv': 'Export track history to CSV file',
        'clear history': 'Clear all track history (cannot be undone)',

        // Tab tooltips
        'total tracks': 'View all tracks in history',
        'automation': 'View tracks from automation runs',
        'bulk downl.': 'View tracks from bulk downloads',
        'this session': 'View tracks from current session'
    };

    /**
     * Apply tooltips to modal elements
     * - Converts title attributes to data-tooltip
     * - Applies tooltips from TOOLTIP_CONFIG based on element id or text content
     * - Skips elements that already have data-tooltip
     * - Avoids nested tooltip conflicts
     * @param {Element} container - The container element to process
     */
    const applyTooltipsToModal = (container) => {
        if (!container) return;

        // Elements that can have tooltips
        const tooltipSelectors = 'button, a[href], input, select, textarea, [role="button"], th[data-sort-key]';
        const elements = container.querySelectorAll(tooltipSelectors);

        elements.forEach(el => {
            // Skip if already has data-tooltip
            if (el.hasAttribute('data-tooltip')) return;

            // Skip if parent already has data-tooltip (avoid nested tooltips)
            if (el.closest('[data-tooltip]') && el.closest('[data-tooltip]') !== el) return;

            // Try to get tooltip from various sources
            let tooltip = null;

            // 1. Check if element has a title attribute - convert to data-tooltip
            if (el.title && el.title.trim()) {
                tooltip = el.title;
                el.removeAttribute('title'); // Remove title to avoid browser tooltip
            }

            // 2. Check TOOLTIP_CONFIG by element id
            if (!tooltip && el.id && TOOLTIP_CONFIG[el.id]) {
                tooltip = TOOLTIP_CONFIG[el.id];
            }

            // 3. Check TOOLTIP_CONFIG by text content (lowercase)
            if (!tooltip) {
                const textContent = (el.textContent || '').trim().toLowerCase();
                if (textContent && TOOLTIP_CONFIG[textContent]) {
                    tooltip = TOOLTIP_CONFIG[textContent];
                }
            }

            // 4. For sortable table headers, add sort tooltip
            if (!tooltip && el.tagName === 'TH' && el.dataset.sortKey) {
                tooltip = `Click to sort by ${el.textContent || el.dataset.sortKey}`;
            }

            // Apply tooltip if found
            if (tooltip) {
                el.setAttribute('data-tooltip', tooltip);
            }
        });

        // Also process td cells with title attributes
        container.querySelectorAll('td[title]').forEach(td => {
            if (!td.hasAttribute('data-tooltip') && td.title) {
                td.setAttribute('data-tooltip', td.title);
                td.removeAttribute('title');
            }
        });
    };

    /**
     * Setup tooltip for a specific button by ID
     * @param {Element} button - The button element
     * @param {string} buttonId - The button ID for lookup in TOOLTIP_CONFIG
     */
    const setupButtonTooltip = (button, buttonId) => {
        if (!button) return;

        // Skip if already has data-tooltip
        if (button.hasAttribute('data-tooltip')) return;

        // Check config
        if (buttonId && TOOLTIP_CONFIG[buttonId]) {
            button.setAttribute('data-tooltip', TOOLTIP_CONFIG[buttonId]);
        }

        // Convert title to data-tooltip
        if (button.title && !button.hasAttribute('data-tooltip')) {
            button.setAttribute('data-tooltip', button.title);
            button.removeAttribute('title');
        }
    };

    /**
     * Add a new tooltip configuration dynamically
     * @param {string} key - The key (element id or text content)
     * @param {string} tooltip - The tooltip text
     */
    const addTooltipConfig = (key, tooltip) => {
        if (key && tooltip) {
            TOOLTIP_CONFIG[key.toLowerCase()] = tooltip;
        }
    };

    /**************************************************************
     *   MODAL BUILDER CLASS
     **************************************************************/
    class SunoModalBuilder {
        constructor(title, options = {}) {
            this.titleText = title;
            this.titleIcon = options.titleIcon || null;
            this.options = {
                id: 'suno-modal-overlay',
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
            this.elements.overlay.className = 'suno-modal-overlay';
            if (this.options.closeOnOverlayClick) {
                this.elements.overlay.classList.add('closable');
            }

            this.elements.modal.className = 'suno-modal-content';
            this.elements.modal.style.maxWidth = this.options.maxWidth;

            if (this.options.customClasses) {
                const classes = Array.isArray(this.options.customClasses) ?
                    this.options.customClasses :
                    this.options.customClasses.split(' ');
                this.elements.modal.classList.add(...classes.filter(Boolean));
            }

            this.elements.titleBar.className = 'suno-modal-title';

            if (this.options.showBackButton) {
                const backBtn = createElement('button', { class: 'suno-btn suno-btn-icon' });
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

            // Add icon to title if provided
            if (this.titleIcon) {
                this.elements.titleH3.appendChild(createIcon(this.titleIcon, '16px'));
            }
            this.elements.titleH3.appendChild(document.createTextNode(this.titleText));
            if (this.options.counter !== undefined && this.options.counter !== null) {
                const counterSpan = document.createElement('span');
                counterSpan.className = 'suno-counter';
                counterSpan.textContent = `(${this.options.counter})`;
                this.elements.titleH3.appendChild(counterSpan);
                this.titleBarElements.counter = counterSpan;
            }
            this.elements.titleBar.appendChild(this.elements.titleH3);

            if (this.options.showCloseButton) {
                const closeBtn = createElement('button', { class: 'suno-btn suno-btn-icon' });
                closeBtn.appendChild(createIcon('xmark'));
                closeBtn.addEventListener('click', () => this.close());
                this.elements.titleBar.appendChild(closeBtn);
                this.titleBarElements.closeButton = closeBtn;
            }

            this.elements.contentArea.className = 'suno-modal-view';
            this.elements.actionsBar.className = 'suno-modal-actions';
            this.elements.leftActions.className = 'suno-modal-actions-left';
            this.elements.rightActions.className = 'suno-modal-actions-right';
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

        // Alias for setContent
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

                // Determine position: explicit > auto-distribute
                if (position === 'right') {
                    this.elements.rightActions.appendChild(button);
                } else if (position === 'left') {
                    this.elements.leftActions.appendChild(button);
                } else {
                    // Auto-distribute if no explicit position
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
            button.className = config.classes ? config.classes.join(' ') : 'suno-btn';
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
                button.onclick = (e) => config.onClick(e, this);
            }
            // Add tooltip support
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
                counterSpan.className = 'suno-counter';
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

                document.body.appendChild(this.elements.overlay);
                requestAnimationFrame(() => {
                    this.elements.overlay.classList.add('visible');
                    // Apply tooltips to modal elements after rendering
                    applyTooltipsToModal(this.elements.modal);
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
            // Only select headers with non-empty data-sort-key values
            this.thead.querySelectorAll('th[data-sort-key]').forEach(th => {
                const sortKey = th.dataset.sortKey;
                // Skip if sortKey is empty or falsy
                if (!sortKey || sortKey === '') return;

                th.classList.add('sortable');
                th.style.cursor = 'pointer';
                this.sortableHeaders.push(th);
                th.addEventListener('click', () => {
                    // Toggle reverse if clicking same column, otherwise sort ascending
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
            if (document.getElementById('suno-toast-container')) {
                this.container = document.getElementById('suno-toast-container');
                return;
            }

            const container = document.createElement('div');
            container.id = 'suno-toast-container';
            document.body.appendChild(container);
            this.container = container;
        }

        removeToast(toastElement) {
            const index = this.activeToasts.findIndex(t => t.element === toastElement);
            if (index > -1) {
                const toast = this.activeToasts[index];
                // Clear timeout if exists
                if (toast.timeoutId) {
                    clearTimeout(toast.timeoutId);
                    toast.timeoutId = null;
                }
                this.activeToasts.splice(index, 1);

                // Process queue if there are pending toasts
                if (this.toastQueue.length > 0 && this.activeToasts.length < this.maxConcurrentToasts) {
                    const queuedToast = this.toastQueue.shift();
                    this._showQueuedToast(queuedToast);
                }
            }
        }

        _showQueuedToast(toastConfig) {
            // This will be called from removeToast to show queued toasts
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
                    success: { icon: 'check', iconColor: 'var(--suno-success)', defaultDuration: 3000 },
                    error: { icon: 'xmark', iconColor: 'var(--suno-error)', defaultDuration: 5000 },
                    warning: { icon: 'xmark', iconColor: 'var(--suno-warning)', defaultDuration: 4000 },
                    info: { icon: 'check', iconColor: 'var(--suno-info)', defaultDuration: 3000 }
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
                        className: 'suno-btn',
                        icon: 'check',
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

                // Check if we're at max capacity
                if (this.activeToasts.length >= this.maxConcurrentToasts) {
                    // Queue this toast instead of showing it immediately
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

        confirm(message, options = {}) {
            return new Promise((resolve) => {
                let resolved = false;
                const toast = this._createToast({
                    message: options.title || 'Confirm',
                    details: message,
                    icon: options.icon || 'check',
                    iconColor: options.iconColor || 'var(--suno-warning)',
                    autoHide: false,
                    buttons: [
                        {
                            text: options.cancelText || 'Cancel',
                            className: 'suno-btn',
                            icon: 'xmark',
                            onClick: () => {
                                if (!resolved) {
                                    resolved = true;
                                    toast.dismiss();
                                    resolve(false);
                                }
                            }
                        },
                        {
                            text: options.confirmText || 'Confirm',
                            className: 'suno-btn btn-success',
                            icon: 'check',
                            onClick: () => {
                                if (!resolved) {
                                    resolved = true;
                                    toast.dismiss();
                                    resolve(true);
                                }
                            }
                        }
                    ],
                    onDismiss: () => {
                        if (!resolved) {
                            resolved = true;
                            resolve(false);
                        }
                    }
                });

                this.activeToasts.push(toast);
                if (this.container && toast.element) {
                    this.container.appendChild(toast.element);
                }
            });
        }

        success(message, duration = 3000) {
            return this._showSimpleToast('Success', message, 'check', 'var(--suno-success)', duration);
        }

        error(message, duration = 5000) {
            return this._showSimpleToast('Error', message, 'xmark', 'var(--suno-error)', duration);
        }

        warning(message, duration = 4000) {
            return this._showSimpleToast('Warning', message, 'xmark', 'var(--suno-warning)', duration);
        }

        info(message, duration = 3000) {
            return this._showSimpleToast('Info', message, 'check', 'var(--suno-info)', duration);
        }

        _showSimpleToast(title, message, icon, iconColor, duration) {
            // Check if we're at max capacity
            if (this.activeToasts.length >= this.maxConcurrentToasts) {
                // Queue this toast
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
                onDismiss: () => this.removeToast(toast.element)
            });

            if (this.container && toast.element) {
                this.container.appendChild(toast.element);
            }

            const originalDismiss = toast.dismiss;
            toast.dismiss = () => {
                this.removeToast(toast.element);
                originalDismiss();
            };

            // Store timeout ID for cleanup
            if (toast.timeoutId) {
                toast.timeoutId = toast.timeoutId;
            }

            this.activeToasts.push(toast);
            return toast;
        }

        _createToast(options) {
            const toast = document.createElement('div');
            toast.className = 'suno-toast';

            const header = document.createElement('div');
            header.className = 'suno-toast-header';

            if (options.icon) {
                const iconEl = createIcon(options.icon);
                iconEl.style.color = options.iconColor || 'var(--suno-info)';
                iconEl.className = 'suno-toast-icon';
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
                messageEl.className = 'suno-toast-message';
                messageEl.textContent = options.details;
                toast.appendChild(messageEl);
            }

            if (options.buttons && options.buttons.length > 0) {
                const buttonsEl = document.createElement('div');
                buttonsEl.className = 'suno-toast-buttons';
                options.buttons.forEach(btnConfig => {
                    const btn = document.createElement('button');
                    btn.className = btnConfig.className || 'suno-btn';
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

            // Add manual close button to all toasts
            const closeBtn = document.createElement('button');
            closeBtn.className = 'suno-toast-close';
            closeBtn.setAttribute('aria-label', 'Close');
            closeBtn.appendChild(createIcon('xmark', '12px'));
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                dismiss();
            };
            header.appendChild(closeBtn);

            let timeoutId = null;
            const dismiss = () => {
                // Clear timeout if exists
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

            // Set up auto-dismiss with stored timeout ID
            if (options.autoHide !== false) {
                timeoutId = setTimeout(dismiss, options.autoHideDuration || 3000);
            }

            return { element: toast, dismiss: dismiss, timeoutId: timeoutId };
        }
    }

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
    // =================================================================================
    // LightBox Manager
    // =================================================================================


    class LightboxManager {
        constructor() {
            this.lightboxEl = null;
            this.overlayEl = null;
            this.imageEl = null;
            this.closeBtn = null;
            this.prevBtn = null;
            this.nextBtn = null;
            this.captionEl = null;
            this.counterEl = null;

            this.currentIndex = 0;
            this.images = [];
            this.isOpen = false;
            this.enabled = GM_getValue(GM_KEYS.lightboxEnabled, true);

            // Scope selectors (similar a TooltipManager)
            this.scopeSelectors = '.suno-readme-container, .suno-modal-overlay, #suno-panel';
            this.imageSelector = 'a.suno-lightbox';

            // Keyboard navigation
            this.boundKeyHandler = this._onKeyDown.bind(this);

            // Lazy initialization - only create elements when first needed
            this._elementsCreated = false;
            this._attachEventListeners();
        }

        enable() {
            this.enabled = true;
            GM_setValue(GM_KEYS.lightboxEnabled, true);
            console.log('Lightbox Enabled');
        }

        disable() {
            this.enabled = false;
            GM_setValue(GM_KEYS.lightboxEnabled, false);
            this.close();
            console.log('Lightbox Disabled');
        }

        toggle() {
            if (this.enabled) {
                this.disable();
            } else {
                this.enable();
            }
            return this.enabled;
        }

        _createLightboxElement() {
            // Check if lightbox already exists to prevent duplicates
            let existingOverlay = document.getElementById('suno-lightbox-overlay');
            if (existingOverlay) {
                this.overlayEl = existingOverlay;
                this.lightboxEl = existingOverlay.querySelector('#suno-lightbox-container');
                this.closeBtn = existingOverlay.querySelector('.suno-lightbox-close');
                this.prevBtn = existingOverlay.querySelector('.suno-lightbox-prev');
                this.nextBtn = existingOverlay.querySelector('.suno-lightbox-next');
                this.imageEl = existingOverlay.querySelector('.suno-lightbox-image');
                this.captionEl = existingOverlay.querySelector('.suno-lightbox-caption');
                this.counterEl = existingOverlay.querySelector('.suno-lightbox-counter');
                return;
            }

            // Overlay
            this.overlayEl = document.createElement('div');
            this.overlayEl.id = 'suno-lightbox-overlay';
            this.overlayEl.className = 'suno-lightbox-overlay';

            // Container
            this.lightboxEl = document.createElement('div');
            this.lightboxEl.id = 'suno-lightbox-container';
            this.lightboxEl.className = 'suno-lightbox-container';

            // Close button
            this.closeBtn = document.createElement('button');
            this.closeBtn.className = 'suno-lightbox-close';
            this.closeBtn.setAttribute('aria-label', 'Close');
            this.closeBtn.appendChild(createIcon('close'));

            // Previous button
            this.prevBtn = document.createElement('button');
            this.prevBtn.className = 'suno-lightbox-prev';
            this.prevBtn.setAttribute('aria-label', 'Previous');
            this.prevBtn.appendChild(createIcon('chevron-back'));

            // Next button
            this.nextBtn = document.createElement('button');
            this.nextBtn.className = 'suno-lightbox-next';
            this.nextBtn.setAttribute('aria-label', 'Next');
            this.nextBtn.appendChild(createIcon('chevron-forward'));

            // Image element
            this.imageEl = document.createElement('img');
            this.imageEl.className = 'suno-lightbox-image';
            this.imageEl.alt = '';

            // Caption
            this.captionEl = document.createElement('div');
            this.captionEl.className = 'suno-lightbox-caption';

            // Counter
            this.counterEl = document.createElement('div');
            this.counterEl.className = 'suno-lightbox-counter';

            // Assemble
            this.lightboxEl.appendChild(this.closeBtn);
            this.lightboxEl.appendChild(this.prevBtn);
            this.lightboxEl.appendChild(this.nextBtn);
            this.lightboxEl.appendChild(this.imageEl);
            this.lightboxEl.appendChild(this.captionEl);
            this.lightboxEl.appendChild(this.counterEl);

            this.overlayEl.appendChild(this.lightboxEl);
            document.body.appendChild(this.overlayEl);
        }

        _attachEventListeners() {
            // Click handler para imágenes con clase suno-lightbox (delegación de eventos)
            document.body.addEventListener('click', (e) => {
                if (!this.enabled) return;

                const target = e.target.closest(this.imageSelector);
                if (!target) return;

                // Verificar que esté dentro del scope
                const scopedParent = target.closest(this.scopeSelectors);
                if (!scopedParent) return;

                e.preventDefault();
                e.stopPropagation();

                // Lazy initialization - create elements only when first image is clicked
                if (!this._elementsCreated) {
                    this._createLightboxElement();
                    this._attachLightboxEventListeners();
                    this._elementsCreated = true;
                }

                this._collectImagesFromScope(scopedParent);
                const clickedIndex = this.images.findIndex(img => img.element === target);
                this.open(clickedIndex >= 0 ? clickedIndex : 0);
            });
        }

        _attachLightboxEventListeners() {

            // Close button
            this.closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });

            // Navigation buttons
            this.prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.previous();
            });

            this.nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.next();
            });

            // Click en overlay para cerrar
            this.overlayEl.addEventListener('click', (e) => {
                if (e.target === this.overlayEl || e.target === this.lightboxEl) {
                    this.close();
                }
            });

            // Prevenir cierre al hacer click en la imagen
            this.imageEl.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Touch swipe support
            let touchStartX = 0;
            let touchEndX = 0;

            this.lightboxEl.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            this.lightboxEl.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this._handleSwipe(touchStartX, touchEndX);
            }, { passive: true });
        }

        _handleSwipe(startX, endX) {
            const threshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) < threshold) return;

            if (diff > 0) {
                // Swipe left - next
                this.next();
            } else {
                // Swipe right - previous
                this.previous();
            }
        }

        _onKeyDown(e) {
            if (!this.isOpen) return;

            switch (e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.previous();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
            }
        }

        _collectImagesFromScope(scopeContainer) {
            this.images = [];
            const imageLinks = scopeContainer.querySelectorAll(this.imageSelector);

            imageLinks.forEach(link => {
                const img = link.querySelector('img');
                if (!img) return;

                this.images.push({
                    element: link,
                    src: link.href,
                    alt: img.alt || '',
                    caption: img.alt || link.getAttribute('title') || ''
                });
            });
        }

        open(index = 0) {
            if (!this.enabled || this.images.length === 0) return;

            // Ensure elements are created (safety check)
            if (!this._elementsCreated || !this.overlayEl) {
                this._createLightboxElement();
                this._attachLightboxEventListeners();
                this._elementsCreated = true;
            }

            this.currentIndex = Math.max(0, Math.min(index, this.images.length - 1));
            this.isOpen = true;

            // Show overlay
            this.overlayEl.classList.add('suno-lightbox-visible');

            // Load image
            this._loadImage(this.currentIndex);

            // Update navigation
            this._updateNavigation();

            // Add keyboard listener
            document.addEventListener('keydown', this.boundKeyHandler);

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }

        close() {
            if (!this.isOpen) return;

            this.isOpen = false;
            this.overlayEl.classList.remove('suno-lightbox-visible');

            // Remove keyboard listener
            document.removeEventListener('keydown', this.boundKeyHandler);

            // Restore body scroll
            document.body.style.overflow = '';

            // Clear image to free memory
            setTimeout(() => {
                if (!this.isOpen) {
                    this.imageEl.src = '';
                }
            }, 300);
        }

        next() {
            if (this.images.length <= 1) return;

            this.currentIndex = (this.currentIndex + 1) % this.images.length;
            this._loadImage(this.currentIndex);
            this._updateNavigation();
        }

        previous() {
            if (this.images.length <= 1) return;

            this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
            this._loadImage(this.currentIndex);
            this._updateNavigation();
        }

        _loadImage(index) {
            const imageData = this.images[index];
            if (!imageData) return;

            // Add loading class
            this.lightboxEl.classList.add('suno-lightbox-loading');

            // Create new image to preload
            const img = new Image();

            img.onload = () => {
                this.imageEl.src = imageData.src;
                this.imageEl.alt = imageData.alt;
                this.captionEl.textContent = imageData.caption;
                this.lightboxEl.classList.remove('suno-lightbox-loading');
            };

            img.onerror = () => {
                this.captionEl.textContent = 'Error loading image';
                this.lightboxEl.classList.remove('suno-lightbox-loading');
            };

            img.src = imageData.src;
        }

        _updateNavigation() {
            // Update counter
            this.counterEl.textContent = `${this.currentIndex + 1} / ${this.images.length}`;

            // Show/hide navigation buttons
            if (this.images.length <= 1) {
                this.prevBtn.style.display = 'none';
                this.nextBtn.style.display = 'none';
                this.counterEl.style.display = 'none';
            } else {
                this.prevBtn.style.display = '';
                this.nextBtn.style.display = '';
                this.counterEl.style.display = '';
            }
        }

        // Preload adjacent images for faster navigation
        preloadAdjacent() {
            if (this.images.length <= 1) return;

            const nextIndex = (this.currentIndex + 1) % this.images.length;
            const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;

            // Preload next
            const nextImg = new Image();
            nextImg.src = this.images[nextIndex].src;

            // Preload previous
            const prevImg = new Image();
            prevImg.src = this.images[prevIndex].src;
        }
    }
    const lightboxManager = new LightboxManager();
    window.lightboxManager = lightboxManager;

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

            this.scopeSelectors = '#suno-panel, .suno-panel, .suno-modal-overlay, .suno-bulk-content, #suno-track-table-container';
            this._createTooltip();
            this._attachEvents();
        }

        _createTooltip() {
            let existingTooltip = document.getElementById('suno-tooltip-container');
            if (existingTooltip) {
                this.tooltipEl = existingTooltip;
                this.contentEl = existingTooltip.querySelector('#suno-tooltip-content');
                this.arrowEl = existingTooltip.querySelector('#suno-tooltip-arrow');
                return;
            }

            this.tooltipEl = document.createElement('div');
            this.tooltipEl.id = 'suno-tooltip-container';
            this.tooltipEl.setAttribute('role', 'tooltip');

            this.contentEl = document.createElement('div');
            this.contentEl.id = 'suno-tooltip-content';

            this.arrowEl = document.createElement('div');
            this.arrowEl.id = 'suno-tooltip-arrow';

            this.tooltipEl.append(this.contentEl, this.arrowEl);
            document.body.appendChild(this.tooltipEl);
        }

        _attachEvents() {
            const handleMouseEnter = (e) => {
                if (!this.enabled) return;
                const target = e.target.closest('[data-tooltip]');
                if (!target || !target.closest(this.scopeSelectors)) return;

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
                const target = e.target.closest('[data-tooltip]');
                if (target === this.currentTarget || !e.relatedTarget || !e.relatedTarget.closest('[data-tooltip]')) {
                    this._scheduleHide();
                }
            };

            document.addEventListener('mouseover', handleMouseEnter, true);
            document.addEventListener('mouseout', handleMouseLeave, true);
            this.tooltipEl.addEventListener('mouseleave', () => this._hide(), true);
            this.tooltipEl.addEventListener('pointerleave', () => this._hide(), true);

            document.addEventListener('scroll', () => this._hide(), { passive: true, capture: true });
            document.addEventListener('mousedown', (e) => {
                if (!this.tooltipEl.contains(e.target)) {
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

            // Position before showing for smooth animation
            this._position(target);

            requestAnimationFrame(() => {
                this.tooltipEl.classList.add('suno-tooltip-visible');
                this.isVisible = true;
            });
        }

        _hide() {
            if (this.showTimeout) {
                clearTimeout(this.showTimeout);
                this.showTimeout = null;
            }
            this._clearHideTimeout();

            this.tooltipEl.classList.remove('suno-tooltip-visible');
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

            // Temporarily show tooltip to get its dimensions (opacity 0)
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

            // Determine best placement
            const placement = this._choosePlacement(target, space, ttRect);

            const pos = this._calculatePosition(placement, tRect, ttRect);

            // Use rounded values to prevent blurry rendering
            const x = Math.round(pos.x);
            const y = Math.round(pos.y);

            this.tooltipEl.style.transform = `translate(${x}px, ${y}px)`;
            this.tooltipEl.style.visibility = '';
            this.tooltipEl.style.display = '';

            // Update placement class without affecting visibility class
            this.tooltipEl.classList.remove('suno-placement-top', 'suno-placement-bottom', 'suno-placement-left', 'suno-placement-right');
            this.tooltipEl.classList.add(`suno-placement-${placement}`);

            this._positionArrow(placement, tRect, { x, y }, ttRect);
        }

        _choosePlacement(target, space, ttRect) {
            const preferTop = target.classList.contains('suno-dropdown-toggle') ||
                target.closest('.suno-dropdown-menu') ||
                target.dataset.tooltipPlacement === 'top';

            if (preferTop && space.top >= ttRect.height + this.CONFIG.SPACING) return 'top';

            const fitsTop = space.top >= ttRect.height + this.CONFIG.SPACING;
            const fitsBottom = space.bottom >= ttRect.height + this.CONFIG.SPACING;
            const fitsRight = space.right >= ttRect.width + this.CONFIG.SPACING;
            const fitsLeft = space.left >= ttRect.width + this.CONFIG.SPACING;

            if (fitsTop) return 'top';
            if (fitsBottom) return 'bottom';
            if (fitsRight) return 'right';
            if (fitsLeft) return 'left';

            // fallback to the side with most space
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


    const tooltipManager = new TooltipManager();
    window.tooltipManager = tooltipManager;

    // Apply persisted UI optimize/blur settings once panel mounts
    const applyStoredUIFlags = () => {
        applyOptimizeUI();
        applyBlurToggle();
    };


    /**************************************************************
     *   UI MASTER BUILDER
     **************************************************************/
    class SunoUIBuilder {
        constructor(schema) {
            this.schema = schema;
        }

        render() {
            return this._createElement(this.schema);
        }

        _createElement(config) {
            const { type } = config;
            let element;

            switch (type) {
                case 'container':
                    element = this._createContainer(config);
                    break;
                case 'section':
                    element = this._createSection(config);
                    break;
                case 'button':
                    element = this._createSmartButton(config);
                    break;
                case 'checkbox':
                    element = this._createCheckbox(config);
                    break;
                case 'row':
                    element = this._createRow(config);
                    break;
                case 'text':
                    element = this._createText(config);
                    break;
                case 'custom':
                    element = this._createCustom(config);
                    break;
                default:
                    element = document.createElement('div');
            }

            if (config.children && Array.isArray(config.children)) {
                config.children.forEach(childConfig => {
                    const childElement = this._createElement(childConfig);
                    if (childElement) {
                        element.appendChild(childElement);
                    }
                });
            }

            if (config.disabled) {
                element.disabled = true;
            }

            return element;
        }

        _applyCommonProperties(element, config) {
            if (config.id) element.id = config.id;
            if (config.className) element.className = config.className;
            if (config.tooltip) element.setAttribute('data-tooltip', config.tooltip);
        }

        _createContainer(config) {
            const container = document.createElement('div');
            this._applyCommonProperties(container, config);
            return container;
        }

        _createRow(config) {
            const row = document.createElement('div');
            row.className = 'button_row';
            if (config.className) {
                row.className += ' ' + config.className;
            }
            this._applyCommonProperties(row, config);
            return row;
        }

        _createText(config) {
            const textElement = document.createElement('div');
            this._applyCommonProperties(textElement, config);
            if (config.label) {
                textElement.textContent = config.label;
            }
            return textElement;
        }

        _createSection(config) {
            const section = document.createElement('div');
            this._applyCommonProperties(section, config);
            if (config.title) {
                const title = document.createElement('h3');
                title.textContent = config.title;
                section.appendChild(title);
            }
            return section;
        }

        _createSmartButton(config) {
            const buttonConfig = {
                id: config.id,
                text: config.label,
                icon: config.icon,
                classes: config.className ? config.className.split(' ') : ['suno-btn'],
                tooltip: config.tooltip,
                handlers: {
                    onClick: config.onClick
                },
                states: config.states,
                showCounter: config.showCounter
            };
            const smartButton = createSmartButton(buttonConfig);
            return smartButton.getElement();
        }

        _createCheckbox(config) {
            const container = document.createElement('div');
            container.className = 'suno-checkbox-container';
            if (config.className) container.className += ' ' + config.className;
            if (config.tooltip) container.setAttribute('data-tooltip', config.tooltip);

            const label = document.createElement('label');
            label.className = 'suno-checkbox-label';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = config.id;
            if (config.onChange) checkbox.addEventListener('change', config.onChange);

            label.appendChild(checkbox);
            if (config.label) {
                label.appendChild(document.createTextNode(' ' + config.label));
            }

            container.appendChild(label);
            return container;
        }

        _createCustom(config) {
            if (config.render && typeof config.render === 'function') {
                return config.render();
            }
            return document.createElement('div');
        }
    }

    /**************************************************************
     *   SUNO TOOLPANEL CLASS
     **************************************************************/
    class SunoToolPanel {
        constructor(options = {}) {
            this.panel = null;
            this.header = null;
            this.controls = null;
            this.logWrapper = null;
            this.logArea = null;
            this.logEntries = [];
            this.maxLogEntries = 100;
            // Extract version and name from GM_info with fallbacks
            this.version = (typeof GM_info !== 'undefined' && GM_info.script?.version)
                ? `${GM_info.script.version}`
                : 'v3.2.5';
            this.name = (typeof GM_info !== 'undefined' && GM_info.script?.name)
                ? GM_info.script.name.replace(/\s*v[\d.]+$/, '') // Remove version suffix if present
                : 'Suno Automation';
            this.isMinimized = false;
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            // Options
            this.options = {
                gradientButtons: options.gradientButtons || false,
                draggable: options.draggable !== false, // default true
                ...options
            };
        }

        createPanel() {
            if (document.getElementById('suno-panel')) {
                this.panel = document.getElementById('suno-panel');
                // Ensure controls and logWrapper references are set
                if (!this.controls) {
                    this.controls = this.panel.querySelector('#suno-panel-controls');
                }
                if (!this.logWrapper) {
                    this.logWrapper = this.panel.querySelector('.suno-panel-log-wrapper');
                }
                return this.panel;
            }

            this.panel = document.createElement('div');
            this.panel.id = 'suno-panel';
            this.panel.className = 'suno-panel';

            // Apply layout version class early to avoid FOUC
            const layoutVersion = GM_getValue(GM_KEYS.layoutVersion, 'v1');
            if (layoutVersion === 'v2') {
                this.panel.classList.add('layout_two');
            }

            // Apply gradient buttons mode if enabled
            if (this.options.gradientButtons) {
                this.panel.classList.add('suno-gradient-btn');
            }

            this.header = this._createHeader();
            this.controls = this._createControls();
            this.logWrapper = this._createLogWrapper();

            this.panel.appendChild(this.header);
            this.panel.appendChild(this.controls);
            this.panel.appendChild(this.logWrapper);

            if (this.options.draggable) {
                this._setupDragging();
            }

            return this.panel;
        }

        toggleGradientButtons(enabled) {
            if (enabled === undefined) {
                this.options.gradientButtons = !this.options.gradientButtons;
            } else {
                this.options.gradientButtons = enabled;
            }

            if (this.panel) {
                this.panel.classList.toggle('suno-gradient-btn', this.options.gradientButtons);
            }
            return this.options.gradientButtons;
        }

        _createHeader() {
            const header = document.createElement('div');
            header.className = 'suno-panel-header';

            const left = document.createElement('div');
            left.className = 'suno-panel-header-left';
            left.appendChild(createIcon('play', '14px'));

            const title = document.createElement('span');
            title.textContent = this.name;
            left.appendChild(title);

            const version = document.createElement('span');
            version.className = 'suno-panel-version';
            version.textContent = this.version;
            //left.appendChild(version);

            const right = document.createElement('div');
            right.className = 'suno-panel-header-right';

            // Gradient toggle button
            const gradientBtn = document.createElement('button');
            gradientBtn.className = 'suno-panel-header-btn hide';
            gradientBtn.setAttribute('data-tooltip', 'Toggle Gradient Style');
            gradientBtn.appendChild(createIcon('chartLine', '12px'));
            gradientBtn.style.opacity = this.options.gradientButtons ? '1' : '0.4';
            gradientBtn.addEventListener('click', () => {
                const enabled = this.toggleGradientButtons();
                gradientBtn.style.opacity = enabled ? '1' : '0.4';
            });
            right.appendChild(gradientBtn);

            // Tooltip toggle button
            const tooltipBtn = document.createElement('button');
            tooltipBtn.className = 'suno-panel-header-btn hide';
            tooltipBtn.setAttribute('data-tooltip', 'Toggle Tooltips');
            tooltipBtn.appendChild(createIcon('check', '12px'));
            tooltipBtn.addEventListener('click', () => {
                const enabled = tooltipManager.toggle();
                tooltipBtn.querySelector('.suno-icon').style.opacity = enabled ? '1' : '0.4';
            });
            right.appendChild(tooltipBtn);

            // Help button
            const helpBtn = document.createElement('button');
            helpBtn.className = 'suno-panel-header-btn';
            helpBtn.setAttribute('data-tooltip', 'Help & Instructions');
            helpBtn.appendChild(createIcon('help-circle', '12px'));
            helpBtn.addEventListener('click', () => showGeneralHelpModal());
            right.appendChild(helpBtn);

            // Settings button
            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'suno-panel-header-btn';
            settingsBtn.setAttribute('data-tooltip', 'Settings');
            settingsBtn.appendChild(createIcon('gear', '12px'));
            settingsBtn.addEventListener('click', () => showSettingsModal());
            right.appendChild(settingsBtn);

            // Minimize button
            const minBtn = document.createElement('button');
            minBtn.className = 'suno-panel-header-btn';
            minBtn.setAttribute('data-tooltip', 'Minimize Panel');
            minBtn.appendChild(createIcon('minus', '12px'));
            minBtn.addEventListener('click', () => this.toggleMinimize());
            right.appendChild(minBtn);

            header.appendChild(version);
            header.appendChild(left);
            header.appendChild(right);

            return header;
        }

        _createControls() {
            const controls = document.createElement('div');
            controls.className = 'suno-panel-controls';
            controls.id = 'suno-panel-controls';
            // Buttons will be added via addButton method
            return controls;
        }

        _createLogWrapper() {
            const wrapper = document.createElement('div');
            wrapper.className = 'suno-panel-log-wrapper';

            // Log action buttons
            const logButtons = document.createElement('div');
            logButtons.className = 'suno-log-buttons';

            const copyBtn = document.createElement('button');
            copyBtn.className = 'suno-log-btn';
            copyBtn.setAttribute('data-tooltip', 'Copy Log');
            copyBtn.appendChild(createIcon('copy', '12px'));
            copyBtn.addEventListener('click', () => this.copyLog());

            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'suno-log-btn';
            downloadBtn.setAttribute('data-tooltip', 'Download Log');
            downloadBtn.appendChild(createIcon('download', '12px'));
            downloadBtn.addEventListener('click', () => this.downloadLog());

            const clearBtn = document.createElement('button');
            clearBtn.className = 'suno-log-btn';
            clearBtn.setAttribute('data-tooltip', 'Clear Log');
            clearBtn.appendChild(createIcon('xmark', '12px'));
            clearBtn.addEventListener('click', () => this.clearLog());

            logButtons.appendChild(copyBtn);
            logButtons.appendChild(downloadBtn);
            logButtons.appendChild(clearBtn);

            // Log area
            this.logArea = document.createElement('div');
            this.logArea.className = 'suno-log-area';
            this.logArea.id = 'suno-log-area';

            wrapper.appendChild(logButtons);
            wrapper.appendChild(this.logArea);

            return wrapper;
        }

        _setupDragging() {
            const el = this.panel;
            const handle = this.header;

            let isDragging = false;
            let rafId = null;
            let initialRect = null;
            let initialMouseX = 0;
            let initialMouseY = 0;
            let currentMouseX = 0;
            let currentMouseY = 0;
            let isStuckToSide = false;
            let stuckSide = null;
            const STICK_ZONE = 30;

            let cachedPanelWidth = 0;
            let cachedPanelHeight = 0;
            let cachedViewportWidth = 0;
            let cachedViewportHeight = 0;

            const updateCachedDimensions = () => {
                const rect = el.getBoundingClientRect();
                cachedPanelWidth = rect.width;
                cachedPanelHeight = rect.height;
                cachedViewportWidth = window.innerWidth;
                cachedViewportHeight = window.innerHeight;
            };

            const checkSideStick = (left) => {
                if (cachedPanelWidth === 0) updateCachedDimensions();
                const distanceToLeft = left;
                const distanceToRight = cachedViewportWidth - left - cachedPanelWidth;
                if (distanceToLeft <= STICK_ZONE && distanceToLeft >= -10) return 'left';
                if (distanceToRight <= STICK_ZONE && distanceToRight >= -10) return 'right';
                return null;
            };

            const applySideStick = (side) => {
                if (el.classList.contains('minimized')) return;
                isStuckToSide = true;
                stuckSide = side;

                el.style.top = '0px';
                el.style.bottom = '0px';
                el.style.height = '100vh';
                el.style.maxHeight = '100vh';
                el.style.transform = '';

                if (side === 'left') {
                    el.style.left = '0px';
                    el.style.right = 'auto';
                } else {
                    el.style.right = '0px';
                    el.style.left = 'auto';
                }

                el.classList.add('stuck-to-side', `stuck-${side}`);
                updateCachedDimensions();
            };

            const MIN_PANEL_HEIGHT = 300;
            let originalPanelHeight = 0;

            const releaseSideStick = (preservePosition = null) => {
                if (!isStuckToSide) return;

                // Capture current visual position BEFORE changing styles
                const currentRect = preservePosition || el.getBoundingClientRect();

                isStuckToSide = false;
                stuckSide = null;

                el.style.width = '';
                el.style.height = '';
                el.style.maxHeight = '';
                el.style.bottom = 'auto';

                // Set position based on where the panel visually was
                el.style.top = currentRect.top + 'px';
                el.style.left = currentRect.left + 'px';
                el.style.right = 'auto';

                el.classList.remove('stuck-to-side', 'stuck-left', 'stuck-right');
            };

            const performDrag = () => {
                if (!isDragging) return;

                const deltaX = currentMouseX - initialMouseX;
                const deltaY = currentMouseY - initialMouseY;

                let newLeft = initialRect.left + deltaX;
                let newTop = initialRect.top + deltaY;

                if (cachedViewportWidth !== window.innerWidth || cachedViewportHeight !== window.innerHeight) {
                    updateCachedDimensions();
                }

                const shouldStick = checkSideStick(newLeft);
                if (shouldStick) {
                    newLeft = shouldStick === 'left' ? 0 : cachedViewportWidth - cachedPanelWidth;
                }

                // Constrain left position
                newLeft = Math.max(0, Math.min(newLeft, cachedViewportWidth - cachedPanelWidth));

                // Elastic height when dragging near bottom of viewport
                const spaceBelow = cachedViewportHeight - newTop;
                if (spaceBelow < originalPanelHeight && !el.classList.contains('minimized')) {
                    // Shrink panel height to fit, with minimum of MIN_PANEL_HEIGHT
                    const newHeight = Math.max(MIN_PANEL_HEIGHT, spaceBelow - 20);
                    el.style.height = newHeight + 'px';
                    el.style.maxHeight = newHeight + 'px';
                    cachedPanelHeight = newHeight;
                } else if (!el.classList.contains('minimized') && !el.classList.contains('stuck-to-side')) {
                    // Reset to original height when there's enough space
                    el.style.height = '';
                    el.style.maxHeight = '';
                    cachedPanelHeight = originalPanelHeight;
                }

                // Constrain top position (allow panel to shrink at bottom)
                newTop = Math.max(0, Math.min(newTop, cachedViewportHeight - MIN_PANEL_HEIGHT));

                const deltaTransformX = Math.round(newLeft - initialRect.left);
                const deltaTransformY = Math.round(newTop - initialRect.top);

                el.style.transform = `translate(${deltaTransformX}px, ${deltaTransformY}px)`;

                rafId = requestAnimationFrame(performDrag);
            };

            const handleMouseMove = (e) => {
                if (!isDragging) return;
                e.preventDefault();
                currentMouseX = e.clientX;
                currentMouseY = e.clientY;
            };

            const closeDragElement = () => {
                if (!isDragging) return;
                isDragging = false;

                if (rafId !== null) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }

                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', closeDragElement);

                el.classList.remove('dragging');

                const finalRect = el.getBoundingClientRect();
                const finalTop = Math.max(0, Math.min(finalRect.top, cachedViewportHeight - MIN_PANEL_HEIGHT));
                const finalLeft = Math.max(0, Math.min(finalRect.left, cachedViewportWidth - cachedPanelWidth));

                const shouldStick = checkSideStick(finalLeft);

                if (shouldStick) {
                    requestAnimationFrame(() => applySideStick(shouldStick));
                } else {
                    if (isStuckToSide) releaseSideStick();
                    el.style.transform = '';
                    el.style.top = finalTop + 'px';
                    el.style.left = finalLeft + 'px';

                    // Finalize height based on final position
                    if (!el.classList.contains('minimized')) {
                        const spaceBelow = cachedViewportHeight - finalTop;
                        if (spaceBelow < originalPanelHeight) {
                            // Keep the elastic height
                            const finalHeight = Math.max(MIN_PANEL_HEIGHT, spaceBelow - 20);
                            el.style.height = finalHeight + 'px';
                            el.style.maxHeight = finalHeight + 'px';
                        } else {
                            // Reset to auto/default height
                            el.style.height = '';
                            el.style.maxHeight = '';
                        }
                    }
                }
            };

            handle.addEventListener('mousedown', (e) => {
                if (e.target.closest('button')) return;
                e.preventDefault();
                e.stopPropagation();

                isDragging = true;

                // IMPORTANT: Capture position BEFORE any style changes
                const capturedRect = el.getBoundingClientRect();

                // Store original panel height for elastic resize
                if (!el.classList.contains('minimized') && !el.classList.contains('stuck-to-side')) {
                    originalPanelHeight = capturedRect.height;
                } else if (originalPanelHeight === 0) {
                    originalPanelHeight = 400; // Default fallback
                }

                isStuckToSide = el.classList.contains('stuck-to-side');
                if (isStuckToSide) {
                    stuckSide = el.classList.contains('stuck-left') ? 'left' : 'right';
                    // Pass the captured rect to preserve position
                    releaseSideStick(capturedRect);
                    updateCachedDimensions();
                }

                initialRect = el.getBoundingClientRect();
                initialMouseX = e.clientX;
                initialMouseY = e.clientY;
                currentMouseX = e.clientX;
                currentMouseY = e.clientY;

                updateCachedDimensions();

                el.style.right = 'auto';
                el.style.bottom = 'auto';
                el.style.top = initialRect.top + 'px';
                el.style.left = initialRect.left + 'px';
                el.style.transform = '';

                initialRect = el.getBoundingClientRect();
                el.classList.add('dragging');

                document.addEventListener('mousemove', handleMouseMove, { passive: false });
                document.addEventListener('mouseup', closeDragElement, { once: true });

                rafId = requestAnimationFrame(performDrag);
            });

            // Double-click header to minimize/restore
            handle.addEventListener('dblclick', (e) => {
                if (e.target.closest('button')) return;
                e.preventDefault();
                this.toggleMinimize();
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                if (!isDragging) {
                    updateCachedDimensions();
                    if (isStuckToSide) {
                        applySideStick(stuckSide);
                    }
                }
            });
        }

        toggleMinimize() {
            this.isMinimized = !this.isMinimized;
            this.panel.classList.toggle('minimized', this.isMinimized);
        }

        addButtonRow(buttons) {
            const row = document.createElement('div');
            row.className = 'suno-button-row';

            buttons.forEach(btnConfig => {
                if (btnConfig.element) {
                    row.appendChild(btnConfig.element);
                } else if (btnConfig.smartButton) {
                    row.appendChild(btnConfig.smartButton.getElement());
                }
            });

            this.controls.appendChild(row);
            return row;
        }

        addLog(message, type = 'info') {
            const entry = document.createElement('div');
            entry.className = `suno-log-entry log-${type}`;

            const time = new Date().toLocaleTimeString();
            entry.textContent = `[${time}] ${message}`;

            this.logArea.appendChild(entry);
            this.logEntries.push({ time, message, type });

            // Limit entries
            while (this.logArea.children.length > this.maxLogEntries) {
                this.logArea.removeChild(this.logArea.firstChild);
                this.logEntries.shift();
            }

            // Auto-scroll to bottom
            this.logArea.scrollTop = this.logArea.scrollHeight;
        }

        copyLog() {
            const text = this.logEntries.map(e => `[${e.time}] ${e.message}`).join('\n');
            navigator.clipboard.writeText(text).then(() => {
                toastManager.success('Log copied to clipboard');
            });
        }

        downloadLog() {
            const text = this.logEntries.map(e => `[${e.time}] [${e.type.toUpperCase()}] ${e.message}`).join('\n');
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `suno-log-${Date.now()}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }

        clearLog() {
            this.logArea.textContent = '';
            this.logEntries = [];
        }

        render() {
            const panel = this.createPanel();
            if (!panel.parentElement) {
                document.body.appendChild(panel);
            }
            return panel;
        }

        show() {
            if (this.panel) this.panel.style.display = 'flex';
        }

        hide() {
            if (this.panel) this.panel.style.display = 'none';
        }
    }

    // Create global toolpanel instance
    let toolPanel = null;
    const getToolPanel = (options = {}) => {
        if (!toolPanel) {
            // Load gradient buttons preference from storage
            const savedGradient = GM_getValue(GM_KEYS.gradientButtons, false);
            toolPanel = new SunoToolPanel({
                gradientButtons: savedGradient,
                draggable: true,
                ...options
            });
        }
        return toolPanel;
    };

    /**************************************************************
     *   LAYOUT BUILDER PATTERN (Legacy - kept for compatibility)
     **************************************************************/
    const createElement = (tag, props = {}, children = []) => {
        const el = document.createElement(tag);
        let prependIcon = null;

        Object.entries(props).forEach(([key, value]) => {
            if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value);
            } else if (key === 'class' || key === 'className') {
                el.className = value;
            } else if (key === 'text' || key === 'textContent') {
                el.textContent = value;
            } else if (key === 'icon') {
                // Support icon: 'icon-name' or icon: { name: 'icon-name', size: '16px' }
                if (typeof value === 'string') {
                    prependIcon = createIcon(value);
                } else if (value && value.name) {
                    prependIcon = createIcon(value.name, value.size || '1em');
                }
            } else if (key.startsWith('on')) {
                el.addEventListener(key.substring(2).toLowerCase(), value);
            } else {
                el.setAttribute(key, value);
            }
        });

        // Prepend icon before text content if specified
        if (prependIcon) {
            el.prepend(prependIcon, ' ');
        }

        children.forEach(child => {
            if (typeof child === 'string') {
                el.appendChild(document.createTextNode(child));
            } else if (child) {
                el.appendChild(child);
            }
        });
        return el;
    };

    const createPanel = (id, title, iconClass, contentFn) => {
        const panel = createElement('div', {
            id: id,
            class: 'suno-panel'
        });

        const titleSpan = createElement('span');
        if (iconClass) titleSpan.appendChild(createIcon(iconClass, '14px'));
        titleSpan.appendChild(document.createTextNode(' ' + title));

        const minimizeBtn = createElement('button', {
            class: 'suno-panel-btn',
            title: 'Minimize'
        });
        minimizeBtn.appendChild(createIcon('minus', '10px'));
        minimizeBtn.addEventListener('click', () => panel.classList.toggle('minimized'));

        const closeBtn = createElement('button', {
            class: 'suno-panel-btn',
            title: 'Close'
        });
        closeBtn.appendChild(createIcon('xmark', '12px'));
        closeBtn.addEventListener('click', () => panel.classList.remove('visible'));

        const header = createElement('div', {
            class: 'suno-panel-header'
        }, [
            titleSpan,
            createElement('div', { class: 'suno-panel-header-actions' }, [minimizeBtn, closeBtn])
        ]);

        const panelContent = createElement('div', {
            class: 'suno-panel-content'
        });

        if (contentFn) {
            const content = contentFn();
            if (Array.isArray(content)) {
                content.forEach(c => panelContent.appendChild(c));
            } else {
                panelContent.appendChild(content);
            }
        }

        panel.appendChild(header);
        panel.appendChild(panelContent);

        // Make draggable with viewport constraints
        let dragData = null;
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('button')) return;
            const rect = panel.getBoundingClientRect();
            dragData = {
                x: e.clientX,
                y: e.clientY,
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            };
            panel.style.cursor = 'grabbing';
            const onMove = (ev) => {
                if (!dragData) return;
                let newLeft = dragData.left + (ev.clientX - dragData.x);
                let newTop = dragData.top + (ev.clientY - dragData.y);
                // Constrain to viewport
                const maxLeft = window.innerWidth - dragData.width;
                const maxTop = window.innerHeight - dragData.height;
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));
                panel.style.right = 'auto';
                panel.style.left = newLeft + 'px';
                panel.style.top = newTop + 'px';
            };
            const onUp = () => {
                dragData = null;
                panel.style.cursor = '';
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });

        return panel;
    };

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

        console.log('[Suno Extension] Ionicons injected');
    };

    // Helper to create Ionicon element
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
    };

    /**************************************************************
     *   UTILITY FUNCTIONS
     **************************************************************/
    const waitForDOM = (callback) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    };

    /**************************************************************
     *   TEXTAREA SELECTOR (FIXED - SIMPLE + CUSTOM MODE)
     **************************************************************/
    const PROMPT_TEXTAREA_SELECTOR_CUSTOM = `
            div.card-popout-boundary div > div:has(button[aria-label="Upsample styles"]):has(textarea) textarea,
            div.card-popout-boundary div > div:has(button[aria-label="Generate random song description"]):has(textarea) textarea
        `;

    const PROMPT_TEXTAREA_SELECTOR_SIMPLE = `
            div.card-popout-boundary textarea[placeholder*="Write some lyrics"],
            div.card-popout-boundary textarea[placeholder*="prompt"],
            div.card-popout-boundary textarea[placeholder*="instrumental"]
        `;

    const getSunoTextareas = () => {
        const textareas = [];
        try {
            const custom = Array.from(document.querySelectorAll(PROMPT_TEXTAREA_SELECTOR_CUSTOM));
            textareas.push(...custom);
        } catch (e) { }
        try {
            const simple = Array.from(document.querySelectorAll(PROMPT_TEXTAREA_SELECTOR_SIMPLE));
            textareas.push(...simple);
        } catch (e) { }
        if (textareas.length === 0) {
            return Array.from(document.querySelectorAll('textarea')).filter(visible);
        }
        return textareas.filter(visible);
    };

    const getPromptTextarea = () => {
        // Use getSunoTextareas which already has proper selectors
        const allTextareas = getSunoTextareas();
        const modeButtons = Array.from(document.querySelectorAll('button')).filter(b => {
            const text = (b.textContent || b.innerText || '').trim();
            return text === 'Simple' || text === 'Custom';
        });
        const simpleButton = modeButtons.find(b => b.textContent?.includes('Simple'));
        const customButton = modeButtons.find(b => b.textContent?.includes('Custom'));
        const simpleModeActive = simpleButton?.classList?.contains('active') ||
            (simpleButton && !customButton?.classList?.contains('active'));
        const hasStylesSection = document.querySelector('button[aria-label="Upsample styles"]') &&
            document.querySelector('button[aria-label="Upsample styles"]').offsetParent !== null;
        const hasSongDescriptionSection = document.querySelector('button[aria-label="Generate random song description"]') &&
            document.querySelector('button[aria-label="Generate random song description"]').offsetParent !== null;
        const isCustomModeVisible = hasStylesSection || hasSongDescriptionSection;

        // Silent mode detection - no verbose logging
        if (simpleModeActive || !isCustomModeVisible) {
            const simpleTextarea = allTextareas.find(t => {
                const placeholder = (t.placeholder || '').toLowerCase();
                const hasLyricsPlaceholder = placeholder.includes('write some lyrics') ||
                    (placeholder.includes('prompt') && placeholder.includes('instrumental')) ||
                    placeholder.includes('leave blank');
                let parent = t.parentElement;
                let isInCustomSection = false;
                let depth = 0;
                while (parent && depth < 10) {
                    if (parent.querySelector('button[aria-label="Upsample styles"]') ||
                        parent.querySelector('button[aria-label="Generate random song description"]')) {
                        isInCustomSection = true;
                        break;
                    }
                    parent = parent.parentElement;
                    depth++;
                }
                return hasLyricsPlaceholder && !isInCustomSection;
            });
            if (simpleTextarea) return simpleTextarea;
        } else {
            const stylesTextarea = allTextareas.find(t => {
                let parent = t.parentElement;
                let depth = 0;
                while (parent && depth < 10) {
                    if (parent.querySelector('button[aria-label="Upsample styles"]')) return true;
                    parent = parent.parentElement;
                    depth++;
                }
                return false;
            });
            if (stylesTextarea) return stylesTextarea;

            const songDescTextarea = allTextareas.find(t => {
                let parent = t.parentElement;
                let depth = 0;
                while (parent && depth < 10) {
                    if (parent.querySelector('button[aria-label="Generate random song description"]')) return true;
                    parent = parent.parentElement;
                    depth++;
                }
                return false;
            });
            if (songDescTextarea) return songDescTextarea;
        }

        // Fallback: textarea with content or first visible
        const textareaWithContent = allTextareas.find(t => (t.value || '').trim().length > 0);
        if (textareaWithContent) return textareaWithContent;

        return allTextareas.length > 0 ? allTextareas[0] : null;
    };

    const getPromptValue = () => {
        const t = getPromptTextarea();
        if (!t) return '';
        return (t.value || '').trim();
    };

    /**************************************************************
     *   HUMAN-LIKE TEXTAREA INPUT SIMULATION
     **************************************************************/
    const dispatchEvents = (el, opts = { input: true, change: true, compositionend: true, keyup: true }) => {
        if (opts.input) {
            el.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
        }
        if (opts.compositionend) {
            el.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, composed: true }));
        }
        if (opts.change) {
            el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        }
        if (opts.keyup) {
            el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, composed: true, key: 'a' }));
        }
    };

    const simulatePaste = (el, text) => {
        el.focus();
        try {
            const pasteEv = new ClipboardEvent('paste', {
                bubbles: true,
                cancelable: true,
                clipboardData: new DataTransfer()
            });
            pasteEv.clipboardData.setData('text/plain', text);
            el.dispatchEvent(pasteEv);
        } catch (e) {
            el.value = text;
            dispatchEvents(el);
        }
    };

    const setTextareaValueHuman = async (textarea, fullText, { chunkDelay = 25, chunkSize = 40, maxRetries = 3 } = {}) => {
        if (!textarea) {
            log('Error: setTextareaValueHuman: textarea is null');
            return false;
        }

        log(`setTextareaValueHuman: Setting text (${fullText.length} chars), attempt 1/${maxRetries}`);

        textarea.focus();
        if (textarea.select) textarea.select();
        textarea.value = '';
        dispatchEvents(textarea);
        await sleep(50);

        let attempts = 0;
        while (attempts < maxRetries) {
            attempts++;

            const setChunks = () => new Promise(resolve => {
                let i = 0;
                function step() {
                    const slice = fullText.slice(i, i + chunkSize);
                    const start = textarea.selectionStart ?? textarea.value.length;
                    const end = textarea.selectionEnd ?? textarea.value.length;

                    try {
                        textarea.setRangeText(slice, start, end, 'end');
                    } catch (e) {
                        textarea.value = textarea.value.slice(0, start) + slice + textarea.value.slice(end);
                    }

                    dispatchEvents(textarea, { input: true });
                    i += chunkSize;

                    if (i < fullText.length) {
                        setTimeout(step, chunkDelay);
                    } else {
                        resolve();
                    }
                }
                step();
            });

            await setChunks();
            await sleep(150);
            dispatchEvents(textarea, { input: true, change: true, keyup: true, compositionend: true });

            const val = (textarea.value || '').trim();
            if (val === fullText.trim()) {
                log(`✅ setTextareaValueHuman: Successfully set text (${val.length} chars)`);
                return true;
            }

            log(`WARNING: setTextareaValueHuman: Value mismatch (attempt ${attempts}/${maxRetries}). Expected: "${fullText.trim()}", Got: "${val}"`);

            if (attempts < maxRetries) {
                log(`🔄 setTextareaValueHuman: Trying paste simulation...`);
                simulatePaste(textarea, fullText);
                await sleep(200);

                const pasteVal = (textarea.value || '').trim();
                if (pasteVal === fullText.trim()) {
                    log(`SUCCESS: setTextareaValueHuman: Successfully set text via paste (${pasteVal.length} chars)`);
                    return true;
                }
            }
        }

        log(`ERROR: setTextareaValueHuman: Failed after ${maxRetries} attempts`);
        return false;
    };

    /**************************************************************
     *   CREATE BUTTON SELECTOR (ROBUST)
     **************************************************************/
    const findCreateButton = () => {
        let btn = document.querySelector('button[aria-label="Create song"]');
        if (btn && visible(btn) && !btn.disabled) return btn;

        btn = Array.from(document.querySelectorAll('button'))
            .filter(visible)
            .filter(b => !b.disabled)
            .find(b => (b.innerText || b.textContent || '').trim().toLowerCase() === 'create');
        if (btn) return btn;

        btn = Array.from(document.querySelectorAll('button'))
            .filter(visible)
            .filter(b => !b.disabled)
            .find(b => ((b.innerText || b.textContent || '').toLowerCase().includes('create') && b.querySelector('svg')));
        if (btn) return btn;

        return null;
    };

    /**************************************************************
     *   SAFE CLICK HELPER
     **************************************************************/
    const safeClick = (el) => {
        if (!el) return false;
        try {
            el.focus?.();
            el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, composed: true }));
            el.click?.();
            return true;
        } catch (e) {
            log(`❌ safeClick error: ${e.message}`);
            return false;
        }
    };

    /**************************************************************
     *   NOTIFICATION SYSTEM (NON-CLICKABLE)
     **************************************************************/
    const createNotificationContainer = () => {
        if (document.querySelector('#custom-toast-container')) return;
        const container = createElement('div', {
            id: 'custom-toast-container'
        });
        container.style.display = 'none';
        document.body.appendChild(container);

        // Also create the mini progress card
        createProgressCard();
    };

    /**************************************************************
     *   CONTENT BUILDER & HELP MODAL SYSTEM
     **************************************************************/

    // ContentBuilder class for building help content from schema
    class ContentBuilder {
        constructor(schema) {
            this.schema = schema;
        }

        render() {
            if (Array.isArray(this.schema)) {
                const fragment = document.createDocumentFragment();
                this.schema.forEach(item => fragment.appendChild(this._createElement(item)));
                return fragment;
            }
            return this._createElement(this.schema);
        }

        _createElement(config) {
            const {
                tag = 'div', text, className, children, ...attrs
            } = config;
            const element = document.createElement(tag);

            if (className) {
                element.className = className;
            }
            if (text) {
                element.textContent = text;
            }

            // Set other HTML attributes like 'id', 'href', etc.
            for (const key in attrs) {
                element.setAttribute(key, attrs[key]);
            }

            if (children && Array.isArray(children)) {
                children.forEach(childConfig => {
                    element.appendChild(this._createElement(childConfig));
                });
            }
            return element;
        }
    }


    // Help content data structure
    const SUNO_HELP_CONTENT_DATA = {
        'trackGeneration': {
            summary: 'Track Generation',
            icon: 'music',
            schema: [
                { tag: 'p', text: 'This tool automates the process of generating tracks on Suno. It automatically clicks the generate button and monitors the progress of track creation.' },
                { tag: 'h4', text: 'Key Features' },
                {
                    tag: 'ul', children: [
                        { tag: 'li', text: 'Automated Generation: Automatically clicks the generate button at specified intervals.' },
                        { tag: 'li', text: 'Progress Tracking: Monitors track generation progress and updates status in real-time.' },
                        { tag: 'li', text: 'Download Management: Automatically downloads completed tracks when ready.' },
                        { tag: 'li', text: 'Session Management: Tracks all generated tracks in the current session with metadata.' }
                    ]
                },
                { tag: 'hr' },
                { tag: 'h4', text: 'How to Use' },
                {
                    tag: 'ol', children: [
                        { tag: 'li', text: 'Navigate to the Suno create page (/create).' },
                        { tag: 'li', text: 'Enter your track prompt and configure settings as desired.' },
                        { tag: 'li', text: 'Click "Start Generating" to begin the automation.' },
                        { tag: 'li', text: 'Monitor progress in the Track Status modal or progress card.' },
                        { tag: 'li', text: 'Use "Pause" to temporarily stop or "Stop Clicks" to end the automation.' }
                    ]
                }
            ]
        },
        'bulkDownloader': {
            summary: 'Bulk Downloader',
            icon: 'download',
            schema: [
                { tag: 'p', text: 'This tool automates the bulk downloading of tracks from your Suno workspace, playlists, or library. It fetches all available tracks and downloads them automatically.' },
                { tag: 'h4', text: 'Key Features' },
                {
                    tag: 'ul', children: [
                        { tag: 'li', text: 'Bulk Fetching: Automatically scrolls through pages and collects all track URLs from your workspace.' },
                        { tag: 'li', text: 'Smart Deduplication: Prevents downloading tracks that have already been downloaded.' },
                        { tag: 'li', text: 'Queue Management: View and manage all fetched tracks before downloading.' },
                        { tag: 'li', text: 'Progress Tracking: Real-time progress updates with statistics and status information.' },
                        { tag: 'li', text: 'Pause/Resume: Pause and resume the fetching or downloading process at any time.' }
                    ]
                },
                { tag: 'hr' },
                { tag: 'h4', text: 'How to Use' },
                {
                    tag: 'ol', children: [
                        { tag: 'li', text: 'Navigate to your workspace, playlist, or library page on Suno.' },
                        { tag: 'li', text: 'Click "Fetch All Tracks" to start collecting track URLs from all pages.' },
                        { tag: 'li', text: 'Wait for the fetch process to complete (you can pause or stop if needed).' },
                        { tag: 'li', text: 'Click "View Queue" to see all fetched tracks and manage them.' },
                        { tag: 'li', text: 'Click "Bulk Download All" to start downloading all fetched tracks.' },
                        { tag: 'li', text: 'Monitor progress in the progress card or queue modal.' }
                    ]
                }
            ]
        }
    };

    // Show individual help modal for a specific tool
    function showHelpModal(toolId) {
        if (!SUNO_HELP_CONTENT_DATA[toolId]) {
            console.warn(`Help content not found for tool: ${toolId}`);
            return;
        }

        const toolData = SUNO_HELP_CONTENT_DATA[toolId];
        const modal = new SunoModalBuilder(toolData.summary, {
            titleIcon: 'help-circle',
            maxWidth: '700px',
            draggable: false
        });

        // Create container for help content
        const helpContainer = document.createElement('div');
        helpContainer.className = 'suno-help-accordion-container';

        // Create details/summary element for the tool
        const details = document.createElement('details');
        details.className = 'suno-modal-instructions';
        details.open = true; // Open by default for individual help

        const summary = document.createElement('summary');
        summary.appendChild(createIcon(toolData.icon));
        summary.appendChild(document.createTextNode(` ${toolData.summary}`));

        const content = new ContentBuilder(toolData.schema).render();

        details.appendChild(summary);
        details.appendChild(content);
        helpContainer.appendChild(details);

        modal.setContent(helpContainer);
        modal.show();
    }

    // Show general help modal with accordion
    function showGeneralHelpModal() {
        if (document.querySelector('.suno-modal-overlay[data-modal="help"]')) return;

        const modal = new SunoModalBuilder('Help & Instructions', {
            titleIcon: 'help-circle',
            maxWidth: '800px',
            draggable: false
        });

        const helpContainer = document.createElement('div');
        helpContainer.className = 'suno-help-accordion-container';

        // Intro text with general instructions using ContentBuilder
        const introContent = document.createElement('div');
        introContent.className = 'suno-modal-instructions suno-help-intro';
        const introSchema = [
            { tag: 'h3', text: 'Welcome to Suno Automation & Download' },
            { tag: 'p', text: 'This panel provides powerful automation tools for Suno track generation and bulk downloading. All tools are accessible at all times and work together to streamline your workflow.' },
            { tag: 'h4', text: 'Getting Started' },
            {
                tag: 'ul', children: [
                    { tag: 'li', text: 'All tools are visible and accessible simultaneously - no need to switch between modes.' },
                    { tag: 'li', text: 'Use the progress card to monitor active processes in real-time.' },
                    { tag: 'li', text: 'The queue manager allows you to view, filter, and manage all fetched tracks before downloading.' },
                    { tag: 'li', text: 'Settings can be accessed from the panel header to customize behavior and appearance.' }
                ]
            },
            { tag: 'hr' },
            { tag: 'h4', text: 'Tool Overview' },
            { tag: 'p', text: 'Below you will find detailed instructions for each tool. Click on any section to expand and view detailed information.' }
        ];
        const introBuilder = new ContentBuilder(introSchema);
        introContent.appendChild(introBuilder.render());
        helpContainer.appendChild(introContent);

        // Build accordion sections from help data
        Object.values(SUNO_HELP_CONTENT_DATA).forEach(sectionData => {
            const details = document.createElement('details');
            details.className = 'suno-modal-instructions';

            const summary = document.createElement('summary');
            summary.appendChild(createIcon(sectionData.icon));
            summary.appendChild(document.createTextNode(` ${sectionData.summary}`));

            const content = new ContentBuilder(sectionData.schema).render();

            details.appendChild(summary);
            details.appendChild(content);
            helpContainer.appendChild(details);
        });

        // Accordion logic: only one section open at a time
        const allDetails = helpContainer.querySelectorAll('details.suno-modal-instructions');
        allDetails.forEach(details => {
            details.addEventListener('toggle', () => {
                if (details.open) {
                    allDetails.forEach(otherDetails => {
                        if (otherDetails !== details) {
                            otherDetails.open = false;
                        }
                    });
                }
            });
        });

        modal.setContent(helpContainer);

        // Add close button
        modal.addButtons([
            {
                text: 'Close',
                icon: 'close',
                classes: ['suno-btn'],
                position: 'right',
                onClick: () => modal.close()
            }
        ]);

        modal.show();
    }

    /**************************************************************
     *   MINI PROGRESS CARD (Dockable, Draggable, Minimizable)
     **************************************************************/
    /**************************************************************
     *   MINI PROGRESS CARD (Dockable, Draggable, Minimizable)
     **************************************************************/
    let progressCardMinimized = false;
    let progressCardDocked = false;
    let progressCardMode = null;

    const createProgressCard = (mode = 'automation') => {
        const existing = document.querySelector('#suno-progress-card');
        if (existing && progressCardMode !== mode) {
            existing.remove();
        } else if (existing) {
            return;
        }
        progressCardMode = mode;

        const card = createElement('div', {
            id: 'suno-progress-card',
            class: 'suno-progress-card'
        });
        if (mode === 'bulk') card.classList.add('bulk-downloader');

        const layoutVersion = GM_getValue(GM_KEYS.layoutVersion, 'v1');
        const isLayoutV2 = layoutVersion === 'v2';

        // Header with controls
        const header = createElement('div', { class: 'suno-progress-header' });

        const title = createElement('div', { class: 'suno-progress-title' });
        title.appendChild(createIcon(mode === 'bulk' ? 'cloud-download-outline' : 'bolt'));
        const titleSpan = createElement('span', { class: 'status-text title' });
        if (mode === 'bulk') {
            titleSpan.textContent = 'Bulk Downloader: Active Process';
            titleSpan.classList.add('status-downloading');
        } else {
            titleSpan.textContent = 'Automation';
        }
        title.appendChild(titleSpan);
        header.appendChild(title);

        const controls = createElement('div', { class: 'suno-progress-controls' });

        // Dock button (only show in Layout V2 or when on create view)
        const dockBtn = createElement('button', {
            class: 'suno-progress-btn',
            'data-tooltip': isLayoutV2 ? 'Dock to Suno Panel' : 'Dock to Suno editor'
        });
        dockBtn.appendChild(createIcon('layers'));
        dockBtn.addEventListener('click', () => {
            progressCardDocked = !progressCardDocked;
            if (progressCardDocked) {
                dockProgressCard();
            } else {
                undockProgressCard();
            }
            card.classList.toggle('docked', progressCardDocked);
            GM_setValue(GM_KEYS.progressCardDocked, progressCardDocked);
        });
        controls.appendChild(dockBtn);
        // Hide dock when not on create view (Version 1 only)
        if (!isLayoutV2 && window.location && window.location.pathname !== '/create') {
            dockBtn.style.display = 'none';
            if (progressCardDocked) {
                progressCardDocked = false;
                undockProgressCard();
            }
        }

        // Expand button (opens Track History modal)
        const expandBtn = createElement('button', {
            class: 'suno-progress-btn',
            'data-tooltip': 'View Full Track History'
        });
        expandBtn.appendChild(createIcon('bar-chart'));
        expandBtn.addEventListener('click', () => {
            showQueueModal();
        });
        controls.appendChild(expandBtn);

        // Minimize button (placed last)
        const minimizeBtn = createElement('button', {
            class: 'suno-progress-btn',
            'data-tooltip': 'Dismiss Progress Card'
        });
        minimizeBtn.appendChild(createIcon('remove'));
        minimizeBtn.addEventListener('click', () => {
            if (card.classList.contains('stopped')) {
                hideProgressCard();
                GM_setValue(GM_KEYS.progressCardVisible, false);
                return;
            }
            progressCardMinimized = !progressCardMinimized;
            card.classList.toggle('minimized', progressCardMinimized);
            card.classList.toggle('visible', !progressCardMinimized);
            updateIcon(minimizeBtn, progressCardMinimized ? 'chevronUp' : 'remove');
            GM_setValue(GM_KEYS.progressCardVisible, !progressCardMinimized);
            updateLogVisibility();
        });
        controls.appendChild(minimizeBtn);

        header.appendChild(controls);
        card.appendChild(header);

        // Content area
        const content = createElement('div', { class: 'suno-progress-content' });

        // Status row
        const statusRow = createElement('div', { class: 'suno-progress-status' });
        const statusIconSpan = createElement('span', { class: 'status-icon' });
        statusIconSpan.appendChild(createIcon('stop', '16px'));
        statusRow.appendChild(statusIconSpan);
        const statusTextSpan = createElement('span', { class: 'status-text' });
        statusTextSpan.textContent = 'Running Process';
        statusRow.appendChild(statusTextSpan);
        content.appendChild(statusRow);

        // Source row (workspace name) - for bulk mode
        const sourceRow = createElement('div', { class: 'suno-progress-source' });
        if (mode === 'bulk') {
            const sourceName = getCurrentFetchSource();
            sourceRow.textContent = sourceName ? `Workspace: ${sourceName.replace(/^(Workspace|Playlist):\s*/, '')}` : '';
            content.appendChild(sourceRow);
        }

        // Stats grid
        const statsGrid = createElement('div', { class: 'suno-progress-stats' });

        const stats = mode === 'bulk' ? [
            { id: 'downloads', icon: 'download', label: 'Downloads', value: '0 / ∞' },
            { id: 'pending', icon: 'cloudDownload', label: 'Pending', value: '0' },
            { id: 'tracks', icon: 'musical-notes', label: 'Tracks', value: '0' }
        ] : [
            { id: 'clicks', icon: 'play', label: 'Clicks', value: '0 / ∞' },
            { id: 'downloads', icon: 'download', label: 'Downloads', value: '0 / ∞' },
            { id: 'pending', icon: 'cloudDownload', label: 'Pending', value: '0' },
            { id: 'tracks', icon: 'music', label: 'Tracks', value: '0' }
        ];

        stats.forEach(stat => {
            const statEl = createElement('div', { class: 'suno-progress-stat', 'data-stat': stat.id });
            const labelRow = createElement('div', { class: 'stat-label' });
            labelRow.appendChild(createIcon(stat.icon));
            labelRow.appendChild(createElement('span', { text: stat.label }));
            statEl.appendChild(labelRow);
            statEl.appendChild(createElement('div', { class: 'stat-value', text: stat.value }));
            statsGrid.appendChild(statEl);
        });

        content.appendChild(statsGrid);

        // Error row (hidden by default)
        const errorRow = createElement('div', { class: 'suno-progress-error hide' });
        errorRow.appendChild(createIcon('warning'));
        const errorTextSpan = createElement('span', { class: 'error-text' });
        errorTextSpan.textContent = '0 errors';
        errorRow.appendChild(errorTextSpan);
        content.appendChild(errorRow);

        // Bulk action buttons (for bulk mode)
        const buttonRow = createElement('div', { class: 'suno-button-row' });
        const bulkPause = createElement('button', {
            id: 'suno-progress-bulk-pause',
            class: 'suno-btn btn-warning',
            disabled: true,
            'data-tooltip': 'Pause the Fetching or Bulk Downloading Process'
        });
        bulkPause.appendChild(createIcon('pause'));
        bulkPause.appendChild(createElement('span', { text: 'Pause' }));
        bulkPause.addEventListener('click', () => {
            toggleQueueDownloadPause();
        });
        const bulkStop = createElement('button', {
            id: 'suno-progress-bulk-stop',
            class: 'suno-btn btn-danger',
            disabled: true,
            'data-tooltip': 'Stop the Fetching or Bulk Downloading Process'
        });
        bulkStop.appendChild(createIcon('stop'));
        bulkStop.appendChild(createElement('span', { text: 'Stop' }));
        bulkStop.addEventListener('click', () => {
            stopQueueDownload();
        });
        buttonRow.appendChild(bulkPause);
        buttonRow.appendChild(bulkStop);
        buttonRow.style.display = mode === 'bulk' ? '' : 'none';
        content.appendChild(buttonRow);

        card.appendChild(content);

        // Bulk progress text (for bulk mode only) - appended directly to card to avoid content padding
        if (mode === 'bulk') {
            const bulkProgress = createElement('div', {
                id: 'suno-bulk-progress',
                class: 'suno-button-row title suno-bulk-progress'
            });
            bulkProgress.appendChild(createIcon('cloud-download'));
            const progressLabel = createElement('span', { class: 'progress-label' });
            // Initial text will be set by updateProgressCard, but set empty for now
            progressLabel.innerHTML = '';
            bulkProgress.appendChild(progressLabel);
            const dismissBtn = createElement('button', {
                class: 'suno-panel-btn',
                'data-tooltip': 'Dismiss Progress Card'
            });
            dismissBtn.appendChild(createIcon('close', '12px'));
            dismissBtn.addEventListener('click', () => {
                card.classList.remove('visible');
                GM_setValue(GM_KEYS.progressCardVisible, false);
                updateLogVisibility();
            });
            bulkProgress.appendChild(dismissBtn);
            card.appendChild(bulkProgress);

            // Bulk table scroll container (for bulk mode only) - appended directly to card to avoid content padding
            const tableScroll = createElement('div', {
                id: 'suno-bulk-table-scroll',
                class: 'suno-bulk-table-scroll hide'
            });

            const table = createElement('table', {
                id: 'suno-bulk-table',
                class: 'suno-table suno-bulk-table'
            });

            // Table header
            const thead = createElement('thead');
            const headerRow = createElement('tr');
            headerRow.appendChild(createElement('th', {
                'data-sort-key': 'index',
                class: 'sortable sorted',
                text: '#'
            }));
            headerRow.appendChild(createElement('th', {
                'data-sort-key': 'title',
                class: 'sortable',
                text: 'Title'
            }));
            headerRow.appendChild(createElement('th', {
                'data-sort-key': 'url',
                class: 'sortable',
                text: 'URL'
            }));
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Table body
            const tbody = createElement('tbody', { id: 'suno-bulk-table-body' });
            table.appendChild(tbody);

            tableScroll.appendChild(table);
            card.appendChild(tableScroll);

            // Initialize table sorter for card's table after it's in DOM
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                setTimeout(() => {
                    if (table.isConnected && table.querySelector('thead') && table.querySelector('tbody')) {
                        try {
                            new TableSorter(table, { key: 'index', reverse: false });
                        } catch (e) {
                            console.warn('Failed to initialize TableSorter for card table:', e);
                        }
                    }
                }, 150);
            });
        }

        // Make draggable
        setupProgressCardDrag(card, header);

        document.body.appendChild(card);
    };

    const setupProgressCardDrag = (card, handle) => {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.closest('button')) return;
            if (progressCardDocked) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = card.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            card.classList.add('dragging');
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            card.style.left = Math.round(startLeft + dx) + 'px';
            card.style.top = Math.round(startTop + dy) + 'px';
            card.style.right = 'auto';
            card.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                card.classList.remove('dragging');
            }
        });
    };

    const hideProgressCard = () => {
        const card = document.querySelector('#suno-progress-card');
        if (card) {
            card.classList.remove('visible');
            card.classList.remove('running', 'paused', 'stopped');
        }
        progressCardMode = null;
        updateLogVisibility();
    };

    const getCurrentFetchSource = () => {
        try {
            const path = window.location?.pathname || '';
            if (path.startsWith('/playlist/')) {
                const title = document.querySelector('h1.font-serif') || document.querySelector('h1');
                const txt = title?.textContent?.trim();
                if (txt) return `Playlist: ${txt}`;
            }
            if (path.startsWith('/me')) {
                const header = document.querySelector('div.flex.items-center.justify-between.px-6');
                const tab = document.querySelector('[role="tab"][aria-selected="true"]') || document.querySelector('.scrollbar-hide [data-state="active"]');
                const headerTxt = header?.textContent?.trim();
                const tabTxt = tab?.textContent?.trim();
                if (headerTxt) return `${headerTxt}${tabTxt ? ' – ' + tabTxt : ''}`;
            }
            if (path.startsWith('/create')) {
                const ws = document.querySelector('.css-13muhl4, .ezrk8uq1') || document.querySelector('.css-mh1tol, .css-jaxow9, .css-11nl96j');
                const txt = ws?.textContent?.trim();
                if (txt) return `Workspace: ${txt}`;
            }
        } catch (e) {
            // ignore
        }
        return document.title || 'Suno';
    };

    const dockProgressCard = () => {
        const card = document.querySelector('#suno-progress-card');
        if (!card) return;

        const layoutVersion = GM_getValue(GM_KEYS.layoutVersion, 'v1');

        if (layoutVersion === 'v2') {
            // Version 2: Dock to panel container
            const bulkControls = document.querySelector('#suno-bulk-controls');
            if (bulkControls) {
                bulkControls.appendChild(card);
                card.style.position = 'relative';
                card.style.left = 'auto';
                card.style.top = 'auto';
                card.style.right = 'auto';
                card.style.bottom = 'auto';
                card.style.width = '100%';
                card.style.margin = '8px 0';
                GM_setValue(GM_KEYS.progressCardDocked, true);
            }
        } else {
            // Version 1: Dock to Suno editor container (current behavior)
            const editorContainer = document.querySelector('.card-popout-boundary.css-1d7w9np');
            if (editorContainer) {
                // Insert after the editor container
                editorContainer.parentNode.insertBefore(card, editorContainer.nextSibling);
                card.style.position = 'relative';
                card.style.left = 'auto';
                card.style.top = 'auto';
                card.style.right = 'auto';
                card.style.bottom = 'auto';
                card.style.width = '100%';
                card.style.margin = '8px 0';
                GM_setValue(GM_KEYS.progressCardDocked, true);
            }
        }
    };

    const undockProgressCard = () => {
        const card = document.querySelector('#suno-progress-card');
        if (!card) return;

        const layoutVersion = GM_getValue(GM_KEYS.layoutVersion, 'v1');

        if (layoutVersion === 'v2') {
            // Version 2: Remove from panel, append to body as floating
            document.body.appendChild(card);
            card.style.position = 'fixed';
            card.style.right = '20px';
            card.style.bottom = '20px';
            card.style.left = 'auto';
            card.style.top = 'auto';
            card.style.width = '';
            card.style.margin = '';
        } else {
            // Version 1: Standard undock behavior
            document.body.appendChild(card);
            card.style.position = 'fixed';
            card.style.right = '20px';
            card.style.bottom = '20px';
            card.style.left = 'auto';
            card.style.top = 'auto';
            card.style.width = '';
            card.style.margin = '';
        }
        GM_setValue(GM_KEYS.progressCardDocked, false);
    };

    // GM Storage functions for progress card state
    const saveProgressCardState = () => {
        const card = document.querySelector('#suno-progress-card');
        if (!card) return;

        GM_setValue(GM_KEYS.progressCardDocked, card.classList.contains('docked'));
        GM_setValue(GM_KEYS.progressCardVisible, card.classList.contains('visible'));
        GM_setValue(GM_KEYS.progressCardMode, progressCardMode);

        let state = null;
        if (card.classList.contains('running')) state = 'running';
        else if (card.classList.contains('paused')) state = 'paused';
        else if (card.classList.contains('stopped')) state = 'stopped';
        GM_setValue(GM_KEYS.progressCardState, state);
    };

    const loadProgressCardState = () => {
        const layoutVersion = GM_getValue(GM_KEYS.layoutVersion, 'v1');
        if (layoutVersion !== 'v2') return; // Only restore in Version 2

        const docked = GM_getValue(GM_KEYS.progressCardDocked, false);
        const visible = GM_getValue(GM_KEYS.progressCardVisible, false);
        const mode = GM_getValue(GM_KEYS.progressCardMode, null);
        const state = GM_getValue(GM_KEYS.progressCardState, null);

        if (mode && (docked || visible)) {
            progressCardMode = mode;
            progressCardDocked = docked;
            if (mode === 'bulk' && bulkDownloaderState.activeProcess) {
                createProgressCard(mode);
                const card = document.querySelector('#suno-progress-card');
                if (card) {
                    if (docked) {
                        card.classList.add('docked');
                        dockProgressCard();
                    }
                    if (visible) {
                        card.classList.add('visible');
                    }
                    if (state) {
                        card.classList.add(state);
                    }
                }
            }
        }
    };

    const updateProgressCard = (data, mode = 'automation') => {
        const card = document.querySelector('#suno-progress-card');
        if (!card || progressCardMode !== mode) {
            if (card) card.remove();
            createProgressCard(mode);
            return updateProgressCard(data, mode);
        }
        card.classList.toggle('bulk-downloader', mode === 'bulk');
        progressCardMode = mode;

        // Show card
        card.classList.add('visible');
        updateLogVisibility();

        // Update status
        const statusIcon = card.querySelector('.status-icon');
        const statusText = card.querySelector('.status-text');
        card.classList.remove('running', 'paused', 'stopped');

        // Clear existing icon
        if (statusIcon) {
            statusIcon.textContent = '';
            statusIcon.className = 'status-icon';
        }

        if (data.isStopped) {
            if (statusIcon) statusIcon.appendChild(createIcon('stop', '16px'));
            if (statusText) statusText.textContent = 'Stopped';
            card.classList.add('stopped');
        } else if (data.isPaused) {
            if (statusIcon) statusIcon.appendChild(createIcon('pause', '16px'));
            if (statusText) statusText.textContent = 'Paused';
            card.classList.add('paused');
        } else {
            if (statusIcon) statusIcon.appendChild(createIcon('play', '16px'));
            if (statusText) statusText.textContent = 'Running...';
            card.classList.add('running');
        }

        // Update stats
        const downloadsStat = card.querySelector('[data-stat="downloads"] .stat-value');
        const pendingStat = card.querySelector('[data-stat="pending"] .stat-value');
        const tracksStat = card.querySelector('[data-stat="tracks"] .stat-value');
        const clicksStat = card.querySelector('[data-stat="clicks"] .stat-value');

        if (downloadsStat) downloadsStat.textContent = `${data.downloads || 0} / ${data.downloadLimit || '∞'}`;
        if (pendingStat) pendingStat.textContent = `${data.pending !== undefined ? data.pending : 0}`;
        if (tracksStat) tracksStat.textContent = `${data.tracks !== undefined ? data.tracks : 0}`;
        if (clicksStat && data.clicks !== undefined) clicksStat.textContent = `${data.clicks || 0} / ${data.clickLimit || '∞'}`;

        // Update source (workspace name) for bulk mode
        const sourceEl = card.querySelector('.suno-progress-source');
        if (sourceEl && mode === 'bulk') {
            const sourceName = data.source || getCurrentFetchSource();
            // Format: "Workspace: [name]" - remove prefix if already present
            const cleanName = sourceName.replace(/^(Workspace|Playlist):\s*/, '');
            sourceEl.textContent = `Workspace: ${cleanName}`;
        }

        // Update title status text for bulk mode
        if (mode === 'bulk') {
            const titleSpan = card.querySelector('.suno-progress-title .status-text.title');
            if (titleSpan) {
                if (data.isStopped) {
                    titleSpan.textContent = 'Bulk Downloader: Stopped';
                    titleSpan.classList.remove('status-downloading');
                } else if (data.isPaused) {
                    titleSpan.textContent = 'Bulk Downloader: Paused';
                    titleSpan.classList.remove('status-downloading');
                } else {
                    titleSpan.textContent = 'Bulk Downloader: Active Process';
                    titleSpan.classList.add('status-downloading');
                }
            }
        }

        // Update error row
        const errorRow = card.querySelector('.suno-progress-error');
        if (errorRow) {
            if (data.errors403 > 0) {
                errorRow.classList.remove('hide');
                const errorText = errorRow.querySelector('.error-text');
                if (errorText) errorText.textContent = `${data.errors403} errors (${data.consecutive403s} consecutive)`;
            } else {
                errorRow.classList.add('hide');
            }
        }

        // Enable/disable bulk buttons based on mode and process state
        const bulkPauseBtn = card.querySelector('#suno-progress-bulk-pause');
        const bulkStopBtn = card.querySelector('#suno-progress-bulk-stop');
        const isBulk = mode === 'bulk';
        const hasActiveProcess = bulkDownloaderState.isFetching || bulkDownloaderState.isDownloading;
        if (bulkPauseBtn) {
            bulkPauseBtn.style.display = isBulk ? '' : 'none';
            // Enable if bulk mode and has active process and not stopped
            bulkPauseBtn.disabled = !isBulk || !hasActiveProcess || !!data.isStopped;
        }
        if (bulkStopBtn) {
            bulkStopBtn.style.display = isBulk ? '' : 'none';
            // Enable if bulk mode and has active process and not stopped
            bulkStopBtn.disabled = !isBulk || !hasActiveProcess || !!data.isStopped;
        }

        // Update bulk progress text in panel and card (bulk mode only) - use same logic for both
        if (mode === 'bulk') {
            // Helper function to get progress text based on state
            const getProgressText = () => {
                // CRITICAL: Only update progress text if NOT paused (prevents constant DOM mutations)
                if (!data.isPaused && !data.isStopped) {
                    if (bulkDownloaderState.isFetching) {
                        return ' Running, Fetching Tracks:<strong>' + (data.tracks || 0) + '</strong>';
                    } else if (bulkDownloaderState.isDownloading) {
                        return ' Running, Downloading Tracks:<strong>' + (data.downloads || 0) + '</strong>';
                    } else {
                        return ' Done! Total unique songs: <strong>' + (data.tracks || 0) + '</strong>';
                    }
                } else if (data.isPaused) {
                    // Update paused state
                    if (bulkDownloaderState.isDownloading) {
                        return ` Paused. Downloading: <strong>${data.downloads || 0}</strong>`;
                    } else if (bulkDownloaderState.isFetching) {
                        return ` Paused. <strong>${data.tracks || 0}</strong> songs collected. Click Resume to continue.`;
                    } else {
                        return ` Paused. <strong>${data.tracks || 0}</strong> songs collected.`;
                    }
                } else if (data.isStopped) {
                    // Update stopped state
                    if (bulkDownloaderState.isDownloading) {
                        return ` Stopped. Downloaded: <strong>${data.downloads || 0}</strong>`;
                    } else {
                        return ` Stopped. <strong>${data.tracks || 0}</strong> songs collected.`;
                    }
                }
                return '';
            };

            const progressText = getProgressText();

            // Update panel progress label (only if not inside card)
            const allProgressElements = document.querySelectorAll('#suno-bulk-progress');
            for (const progressEl of allProgressElements) {
                // Skip if inside card
                if (card.contains(progressEl)) continue;

                const progressLabel = progressEl.querySelector('.progress-label');
                if (progressLabel && progressText) {
                    progressLabel.innerHTML = progressText;
                }
            }

            // Update card progress label (same logic)
            const cardProgress = card.querySelector('#suno-bulk-progress');
            if (cardProgress) {
                const cardProgressLabel = cardProgress.querySelector('.progress-label');
                if (cardProgressLabel && progressText) {
                    cardProgressLabel.innerHTML = progressText;
                }
            }

            // CRITICAL: Only update table if NOT paused (prevents constant DOM mutations)
            if (!data.isPaused && !data.isStopped) {
                updateBulkTable();
            }
        }
    };

    // Update bulk table with fetched tracks - includes status classes and queue status
    // Update log visibility based on progress card state
    const updateLogVisibility = () => {
        const logWrapper = document.querySelector('.suno-panel-log-wrapper');
        const card = document.querySelector('#suno-progress-card');

        if (!logWrapper) return;

        const isCardDocked = card && card.classList.contains('docked');

        // Hide log only when card is docked
        if (isCardDocked) {
            logWrapper.classList.add('hide');
        } else {
            logWrapper.classList.remove('hide');
        }
    };

    // Helper function to populate a tbody with songs data
    const populateTableBody = (tbody, songs, trackStatusMap, tableScroll) => {
        if (!tbody) return;

        // Clear existing rows
        tbody.innerHTML = '';

        if (songs.length === 0) {
            // Hide table when empty
            if (tableScroll) {
                tableScroll.classList.add('hide');
            }
            return;
        }

        // Show table
        if (tableScroll) {
            tableScroll.classList.remove('hide');
        }

        // Add rows for each song with status classes
        songs.forEach((song, index) => {
            const row = createElement('tr');

            // Get status from map or song itself
            const statusInfo = trackStatusMap.get(song.id) || {
                status: song.queueStatus || 'pending',
                isDuplicate: song.isDuplicate || false,
                error: song.error || null,
                reason: song.reason || null
            };

            // Add status class to row (status-completed, status-pending, status-duplicate)
            const statusClass = statusInfo.status || 'pending';
            if (statusClass === 'completed' || statusClass === 'downloaded') {
                row.classList.add('status-completed');
            } else if (statusInfo.isDuplicate || statusClass === 'duplicate' || statusClass === 'skipped') {
                row.classList.add('status-duplicate');
            } else {
                row.classList.add('status-pending');
            }

            // Index column
            const indexCell = createElement('td', { 'data-value': (index + 1).toString() });
            indexCell.textContent = (index + 1).toString();
            row.appendChild(indexCell);

            // Title column
            const titleCell = createElement('td', { 'data-value': song.title || song.rawTitle || '' });
            titleCell.textContent = song.title || song.rawTitle || 'Unknown';
            row.appendChild(titleCell);

            // URL column
            const urlCell = createElement('td', {
                'data-value': song.url || '',
                title: song.url || '',
                style: 'cursor: pointer;'
            });
            if (song.url) {
                // Truncate URL for display
                const urlParts = song.url.split('/');
                const filename = urlParts[urlParts.length - 1] || song.url;
                const displayUrl = filename.length > 30 ? '...' + filename.slice(-27) : filename;
                urlCell.textContent = displayUrl;
                urlCell.addEventListener('click', () => {
                    window.open(song.url, '_blank');
                });
            } else {
                urlCell.textContent = '-';
            }
            row.appendChild(urlCell);

            // Add tooltip with status explanation
            let tooltipText = `Status: ${statusClass}`;
            if (statusInfo.isDuplicate || statusClass === 'duplicate' || statusClass === 'skipped') {
                tooltipText += ' (Duplicate)';
            }
            if (statusInfo.reason) {
                tooltipText += ` - ${statusInfo.reason}`;
            }
            if (statusInfo.error) {
                tooltipText += ` - Error: ${statusInfo.error}`;
            }
            row.setAttribute('title', tooltipText);
            row.setAttribute('data-tooltip', tooltipText);

            tbody.appendChild(row);
        });

        // Auto-scroll to latest processed item
        if (songs.length > 0 && tableScroll) {
            setTimeout(() => {
                const rows = tbody.querySelectorAll('tr');
                if (rows.length > 0) {
                    // If downloading, scroll to last completed item
                    // If fetching, scroll to bottom (last item)
                    let scrollToIndex = rows.length - 1;

                    if (bulkDownloaderState.isDownloading) {
                        // Find last completed row
                        for (let i = rows.length - 1; i >= 0; i--) {
                            if (rows[i].classList.contains('status-completed')) {
                                scrollToIndex = i;
                                break;
                            }
                        }
                    }

                    // Scroll the row into view
                    rows[scrollToIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    // Also scroll the table container to bottom
                    tableScroll.scrollTop = tableScroll.scrollHeight;
                }
            }, 100);
        }
    };

    // Helper function to ensure TableSorter is initialized for a table
    // Uses a data attribute to track if TableSorter has been initialized
    const ensureTableSorter = (table) => {
        if (!table || !table.isConnected) return;

        // Check if TableSorter has already been initialized for this table
        if (table.dataset.sorterInitialized === 'true') {
            return; // Already initialized
        }

        // Check if table has the required structure
        const headers = table.querySelectorAll('thead th[data-sort-key]');
        if (headers.length === 0) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        // Initialize TableSorter
        try {
            // Get current sort state if any
            const sortedHeader = table.querySelector('thead th.sorted');
            const currentSortKey = sortedHeader ? sortedHeader.dataset.sortKey : 'index';
            const currentReverse = sortedHeader ? sortedHeader.classList.contains('reverse') : false;

            new TableSorter(table, { key: currentSortKey, reverse: currentReverse });

            // Mark as initialized
            table.dataset.sorterInitialized = 'true';
        } catch (e) {
            console.warn('Failed to initialize TableSorter:', e);
        }
    };

    const updateBulkTable = () => {
        // Update both card table and standalone table
        const card = document.querySelector('#suno-progress-card');
        const standaloneTableScroll = document.querySelector('#suno-bulk-table-scroll:not(#suno-progress-card #suno-bulk-table-scroll)');

        // CRITICAL: Don't update table if paused (prevents constant DOM mutations)
        if (bulkDownloaderState.isPaused) return;

        // Get songs from both fetch state and queue (merge for complete view)
        const fetchedSongs = Array.from(bulkDownloaderState.fetch.allSongs.values());
        const queueSongs = fetchQueue || [];

        // Create a map of all tracks with their status from queue
        const trackStatusMap = new Map();
        queueSongs.forEach(track => {
            trackStatusMap.set(track.id, {
                status: track.queueStatus || 'pending',
                isDuplicate: track.isDuplicate || false,
                error: track.error || null,
                reason: track.reason || null
            });
        });

        // Use queue songs if available (more complete), otherwise use fetched songs
        const songs = queueSongs.length > 0 ? queueSongs : fetchedSongs;

        // Get table elements - try card first, then standalone
        let tableScroll = null;
        let tbody = null;
        let table = null;

        if (card && card.classList.contains('bulk-downloader')) {
            tableScroll = card.querySelector('#suno-bulk-table-scroll');
            tbody = card.querySelector('#suno-bulk-table-body');
            table = tableScroll ? tableScroll.querySelector('table') : null;
        }

        // Also update standalone table if it exists
        if (standaloneTableScroll) {
            const standaloneTbody = standaloneTableScroll.querySelector('#suno-bulk-table-body');
            const standaloneTable = standaloneTableScroll.querySelector('table');
            if (standaloneTbody) {
                // Update standalone table
                populateTableBody(standaloneTbody, songs, trackStatusMap, standaloneTableScroll);

                // Ensure TableSorter is initialized for standalone table
                if (standaloneTable) {
                    setTimeout(() => ensureTableSorter(standaloneTable), 50);
                }

                // Use standalone table if card table doesn't exist
                if (!tableScroll) {
                    tableScroll = standaloneTableScroll;
                    tbody = standaloneTbody;
                    table = standaloneTable;
                }
            }
        }

        // Update card table if it exists
        if (tableScroll && tbody) {
            populateTableBody(tbody, songs, trackStatusMap, tableScroll);

            // Ensure TableSorter is initialized for card table
            if (table) {
                setTimeout(() => ensureTableSorter(table), 50);
            }
        }
    };

    const updateNotification = (clicksRemaining, downloadsPending) => {
        const container = document.querySelector('#custom-toast-container');
        const stopButton = document.querySelector('#stop-clicks-button');
        const pauseButton = document.querySelector('#pause-automation-button');

        if (!container) return;

        const clicksRemainingNum = typeof clicksRemaining === 'number'
            ? clicksRemaining
            : (CLICK_LIMIT === 0 ? Infinity : Math.max(0, CLICK_LIMIT - totalClicks));

        const pending = downloadsPending !== undefined ? downloadsPending : dataKeyQueue.length;
        const trackCount = trackMetadata.size;

        // Check if automation is truly done:
        // - Must have done at least one click OR user stopped
        // - No pending downloads
        // - Either user stopped OR reached click limit (when limit is set)
        const hasStarted = totalClicks > 0 || totalDownloads > 0;
        const clicksComplete = stopClicks || (CLICK_LIMIT > 0 && totalClicks >= CLICK_LIMIT);
        const downloadsComplete = pending === 0 && dataKeyQueue.length === 0;
        const allDone = hasStarted && clicksComplete && downloadsComplete;

        // Enable Track Status button during automation (has data to show)
        const statusButton = document.querySelector('#suno-toggle-status');
        if (statusButton && hasStarted) {
            statusButton.disabled = false;
        }

        if (allDone) {
            // Hide mini progress card
            const progressCard = document.querySelector('#suno-progress-card');
            if (progressCard) progressCard.classList.remove('visible');
            container.style.display = 'none';

            // Don't remove buttons - just disable them
            if (stopButton) stopButton.disabled = true;
            if (pauseButton) pauseButton.disabled = true;
            log('SUCCESS: All tasks completed');
        } else {
            // Enable controls during automation
            if (stopButton) stopButton.disabled = false;
            if (pauseButton) pauseButton.disabled = false;

            // Update mini progress card instead of old toast
            updateProgressCard({
                clicks: totalClicks,
                clickLimit: CLICK_LIMIT,
                downloads: totalDownloads,
                downloadLimit: DOWNLOAD_LIMIT,
                pending: pending,
                queue: dataKeyQueue.length,
                tracks: trackCount,
                errors403: total403s,
                consecutive403s: consecutive403s,
                isPaused: window.automationPaused,
                isStopped: stopClicks
            });

            // Hide old container (will be replaced by progress card)
            container.style.display = 'none';
        }
    };

    /**************************************************************
     *   QUEUE MODAL - Full featured modal matching Track Generation
     *   Includes tabs, search, progress, and all functionality
     **************************************************************/

    let queueModal = null;
    let queueModalFilter = 'all'; // all, pending, completed, failed, skipped (legacy single filter)
    let queueModalActiveFilters = new Set(['all']); // Active filters for combined AND filtering
    let queueModalSearch = '';
    let queueModalOptionalVisible = false; // Track optional columns visibility state

    // Legacy queueModalState - now uses bulkDownloaderState
    let queueModalState = {
        get isDownloading() { return bulkDownloaderState.isDownloading && bulkDownloaderState.activeProcess === 'download'; },
        set isDownloading(v) { if (v) { bulkDownloaderState.isDownloading = true; bulkDownloaderState.activeProcess = 'download'; } else { bulkDownloaderState.isDownloading = false; if (bulkDownloaderState.activeProcess === 'download') bulkDownloaderState.activeProcess = null; } },
        get downloadPaused() { return bulkDownloaderState.isPaused && bulkDownloaderState.activeProcess === 'download'; },
        set downloadPaused(v) { bulkDownloaderState.isPaused = v; },
        get isFetching() { return bulkDownloaderState.isFetching && bulkDownloaderState.activeProcess === 'fetch'; },
        set isFetching(v) { if (v) { bulkDownloaderState.isFetching = true; bulkDownloaderState.activeProcess = 'fetch'; } else { bulkDownloaderState.isFetching = false; if (bulkDownloaderState.activeProcess === 'fetch') bulkDownloaderState.activeProcess = null; } },
        get fetchPaused() { return bulkDownloaderState.isPaused && bulkDownloaderState.activeProcess === 'fetch'; },
        set fetchPaused(v) { bulkDownloaderState.isPaused = v; },
        get activeProcess() { return bulkDownloaderState.activeProcess; },
        set activeProcess(v) { bulkDownloaderState.activeProcess = v; },
        get currentIndex() { return bulkDownloaderState.download.currentIndex; },
        set currentIndex(v) { bulkDownloaderState.download.currentIndex = v; },
        get totalToDownload() { return bulkDownloaderState.download.total; },
        set totalToDownload(v) { bulkDownloaderState.download.total = v; },
        downloadLog: [] // Progress log entries (kept separate for modal display)
    };

    // Lightweight helpers to avoid TDZ with later utilities
    const normalizeTitleForQueue = (name = '') => {
        return name.toLowerCase().replace(/[^a-z0-9]/gi, '').trim();
    };
    const parseDurationSecondsSafe = (duration) => {
        if (!duration) return null;
        if (typeof duration === 'number') return duration;
        const parts = String(duration).split(':').map(p => parseInt(p, 10));
        if (parts.length === 2 && !parts.some(isNaN)) {
            return parts[0] * 60 + parts[1];
        }
        return null;
    };
    const isQueueDuplicate = (track = {}) => {
        if (track.id && isTrackInDownloadedMatches(track.id)) return true;
        const norm = normalizeTitleForQueue(track.rawTitle || track.title || '');
        const durSec = parseDurationSecondsSafe(track.durationSeconds || track.duration);
        if (norm && Array.isArray(importedFilesCache) && importedFilesCache.length) {
            return importedFilesCache.some(file => {
                const nameMatch = file.normalized && (norm === file.normalized || norm.includes(file.normalized) || file.normalized.includes(norm));
                const durMatch = file.durationSeconds && durSec && Math.abs(file.durationSeconds - durSec) <= 2;
                return nameMatch || durMatch;
            });
        }
        return false;
    };
    const applyQueueDuplicateFlag = (track) => {
        if (!track) return;
        track.isDuplicate = isQueueDuplicate(track);
    };

    // Selected actions dropdown helpers (scoped by IDs)
    const setSelectedActionTrigger = (btn) => {
        const trigger = document.getElementById('queue-selected-actions-dropdown-title');
        if (!trigger || !btn) return;
        // Swap classes to mirror the chosen action style while keeping id/active
        const baseClasses = ['suno-btn'];
        const btnClasses = Array.from(btn.classList).filter(c => c !== 'suno-btn');
        trigger.className = [...baseClasses, ...btnClasses, 'active'].join(' ').trim();
        const iconEl = btn.querySelector('.suno-icon');
        const textEl = btn.querySelector('span');
        trigger.textContent = '';
        if (iconEl) {
            trigger.appendChild(createIcon(iconEl.getAttribute('name') || 'play'));
        }
        trigger.appendChild(createElement('span', { text: textEl ? textEl.textContent : 'Select Action' }));
    };

    const resetSelectedActionTrigger = () => {
        const trigger = document.getElementById('queue-selected-actions-dropdown-title');
        if (!trigger) return;
        trigger.className = 'dropdown-toggle suno-btn active';
        trigger.textContent = '';
        trigger.appendChild(createElement('span', { text: 'Select Action' }));
        trigger.appendChild(createIcon('play'));
    };

    const updateSelectedActionsState = () => {
        const selectedCount = queueSelection.size;
        const trigger = document.getElementById('queue-selected-actions-dropdown-title');
        const menu = document.getElementById('queue-actions-dropdown-menu');
        const resetBtn = document.querySelector('.suno-selected-actions .reset-btn');
        const options = [
            document.getElementById('queue-modal-refetch-selected-btn'),
            document.getElementById('queue-modal-download-selected-btn'),
            document.getElementById('queue-modal-remove-selected-btn')
        ];
        const disable = selectedCount === 0 || queueModalState.activeProcess;
        if (trigger) {
            trigger.disabled = disable;
            trigger.classList.toggle('active', !disable);
        }
        options.forEach(btn => {
            if (btn) {
                btn.disabled = disable;
            }
        });
        if (resetBtn) resetBtn.disabled = disable;
        if (disable && menu) menu.classList.remove('show');
        if (selectedCount === 0) {
            resetSelectedActionTrigger();
        }
    };

    const bindSelectedActionsDropdown = () => {
        const trigger = document.getElementById('queue-selected-actions-dropdown-title');
        const menu = document.getElementById('queue-actions-dropdown-menu');
        const resetBtn = document.querySelector('.suno-selected-actions .reset-btn');
        const actionsGroup = document.querySelector('.suno-selected-actions');
        const options = [
            document.getElementById('queue-modal-refetch-selected-btn'),
            document.getElementById('queue-modal-download-selected-btn'),
            document.getElementById('queue-modal-remove-selected-btn')
        ];
        if (!trigger || !menu) return;

        // Ensure menu starts closed
        menu.classList.remove('show');

        const toggleMenu = (e) => {
            e.stopPropagation();
            if (trigger.disabled) return;
            const nowShown = !menu.classList.contains('show');
            menu.classList.toggle('show', nowShown);
            menu.style.display = nowShown ? 'flex' : 'none';
        };
        trigger.addEventListener('click', toggleMenu);

        if (!menu.dataset.bound) {
            const closeIfOutside = (evt) => {
                if (menu.contains(evt.target) || trigger.contains(evt.target) || (actionsGroup && actionsGroup.contains(evt.target))) return;
                menu.classList.remove('show');
                menu.style.display = 'none';
            };
            document.addEventListener('click', closeIfOutside, true);
            menu.addEventListener('click', (evt) => {
                evt.stopPropagation();
            });
            menu.dataset.bound = 'true';
        }
        options.forEach(btn => {
            if (!btn) return;
            btn.addEventListener('click', () => {
                setSelectedActionTrigger(btn);
                menu.classList.remove('show');
                menu.style.display = 'none';
            });
        });
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.remove('show');
                menu.style.display = 'none';
                resetSelectedActionTrigger();
            });
        }
    };

    const QUEUE_LOG_LIMIT = 400; // Prevents unbounded memory usage from log growth

    const renderQueueModalLogEntryFromState = (entry) => {
        const log = document.getElementById('queue-modal-log');
        if (!log || !entry) return;
        const row = createElement('div', { class: `suno-queue-log-entry ${entry.type || 'info'}` });
        row.appendChild(createElement('span', { class: 'log-time', text: new Date(entry.time).toLocaleTimeString() }));
        row.appendChild(createElement('span', { class: 'log-message', text: entry.message }));
        log.appendChild(row);
        log.scrollTop = log.scrollHeight;
    };

    const hydrateQueueModalLog = () => {
        const log = document.getElementById('queue-modal-log');
        if (!log) return;
        log.textContent = '';
        queueModalState.downloadLog.forEach(renderQueueModalLogEntryFromState);
    };

    const lockProcessButton = (btn, disable) => {
        if (!btn) return;
        if (disable) {
            btn.dataset.processLocked = 'true';
            btn.disabled = true;
        } else if (btn.dataset.processLocked) {
            btn.disabled = false;
            delete btn.dataset.processLocked;
        }
    };

    const showQueueProgress = (message = '') => {
        const progressSection = document.getElementById('queue-modal-progress-section');
        const progressText = document.getElementById('queue-modal-progress-text');
        if (progressSection) progressSection.style.display = 'block';
        if (progressText && message) progressText.textContent = message;
    };

    const hideQueueProgress = () => {
        const progressSection = document.getElementById('queue-modal-progress-section');
        if (progressSection) progressSection.style.display = 'none';
    };

    const updateQueueProcessControls = () => {
        const fetchBtn = document.getElementById('queue-modal-fetch-btn');
        const fetchBtnStandalone = document.getElementById('queue-fetch-btn');
        const downloadBtns = document.querySelectorAll('#queue-modal-download-selected-btn, #queue-modal-download-all-btn');
        const clearBtn = document.getElementById('queue-modal-clear-btn');
        const pauseBtn = document.getElementById('queue-modal-pause-btn');
        const stopBtn = document.getElementById('queue-modal-stop-btn');
        const progressSection = document.getElementById('queue-modal-progress-section');

        const isFetching = queueModalState.isFetching || queueMeta.isFetching || fetchState.fetching;
        const isDownloading = queueModalState.isDownloading || queueMeta.isDownloading;
        const activeProcess = isDownloading ? 'download' : (isFetching ? 'fetch' : null);
        queueModalState.activeProcess = activeProcess;

        const disableActions = !!activeProcess;
        lockProcessButton(fetchBtn, disableActions);
        lockProcessButton(fetchBtnStandalone, disableActions);
        downloadBtns.forEach(btn => lockProcessButton(btn, disableActions));
        lockProcessButton(clearBtn, disableActions);
        const dropdownTrigger = document.getElementById('queue-selected-actions-dropdown-title');
        const dropdownMenu = document.getElementById('queue-actions-dropdown-menu');
        const dropdownReset = document.querySelector('.suno-selected-actions .reset-btn');
        const selectedActionButtons = [
            document.getElementById('queue-modal-refetch-selected-btn'),
            document.getElementById('queue-modal-download-selected-btn'),
            document.getElementById('queue-modal-remove-selected-btn')
        ];
        if (dropdownTrigger) dropdownTrigger.disabled = disableActions || queueSelection.size === 0;
        selectedActionButtons.forEach(btn => { if (btn) btn.disabled = disableActions || queueSelection.size === 0; });
        if (dropdownReset) dropdownReset.disabled = disableActions || queueSelection.size === 0;
        if ((disableActions || queueSelection.size === 0) && dropdownMenu) dropdownMenu.classList.remove('show');
        if (progressSection) {
            progressSection.style.display = activeProcess ? 'block' : 'none';
        }

        if (pauseBtn) {
            pauseBtn.disabled = !activeProcess;
            const isPaused = activeProcess === 'download'
                ? (queueModalState.downloadPaused || queueMeta.downloadPaused)
                : activeProcess === 'fetch'
                    ? (queueModalState.fetchPaused || queueMeta.fetchPaused || fetchState.paused)
                    : false;
            updateIcon(pauseBtn, isPaused ? 'play' : 'pause');
            const span = pauseBtn.querySelector('span');
            if (span) span.textContent = isPaused ? 'Resume' : 'Pause';
        }

        if (stopBtn) stopBtn.disabled = !activeProcess;
        updateSelectedActionsState();
    };

    // Update Queue Modal during fetch operations
    const updateQueueModalDuringFetch = (message) => {
        const queueOverlay = document.querySelector('.suno-modal-overlay[data-modal="queue"]');
        if (!queueOverlay || !queueOverlay.classList.contains('visible')) return;

        // Show progress section
        const progressSection = document.getElementById('queue-modal-progress-section');
        if (progressSection) progressSection.style.display = 'block';

        // Update progress text
        const progressText = document.getElementById('queue-modal-progress-text');
        if (progressText) {
            const label = progressText.querySelector('.suno-queue-progress-label');
            if (label) {
                label.textContent = message;
            } else {
                progressText.textContent = message;
            }
        }

        // Update stats
        updateQueueModalStats();

        // Update table (throttled - only update every 500ms to prevent lag)
        if (!updateQueueModalDuringFetch._lastUpdate || Date.now() - updateQueueModalDuringFetch._lastUpdate > 500) {
            updateQueueModalTable();
            updateQueueModalDuringFetch._lastUpdate = Date.now();
        }
    };

    // Apply optional columns visibility state
    const applyQueueModalOptionalColumns = () => {
        const table = document.getElementById('suno-queue-modal-table');
        if (!table) return;
        const optionalCols = table.querySelectorAll('.optional-column');
        optionalCols.forEach(col => {
            col.style.display = queueModalOptionalVisible ? '' : 'none';
        });
    };

    // Get filtered queue based on current filter and search
    const getFilteredQueueForModal = () => {
        let filtered = [...fetchQueue];

        // Apply combined AND filtering (multiple active filters)
        // If 'all' is active, show everything (no filtering)
        if (!queueModalActiveFilters.has('all') && queueModalActiveFilters.size > 0) {
            filtered = filtered.filter(t => {
                const status = t.queueStatus || 'pending';
                let matchesAll = true;

                // Check each active filter - ALL must match (AND logic)
                for (const filterId of queueModalActiveFilters) {
                    if (filterId === 'all') {
                        // 'all' means no filtering, so skip
                        continue;
                    }

                    let matchesThisFilter = false;

                    if (filterId === 'duplicates') {
                        matchesThisFilter = t.isDuplicate;
                    } else if (filterId === 'unique') {
                        matchesThisFilter = !t.isDuplicate;
                    } else if (filterId === 'pending' || filterId === 'completed' || filterId === 'failed' || filterId === 'skipped') {
                        matchesThisFilter = status === filterId;
                    }

                    if (!matchesThisFilter) {
                        matchesAll = false;
                        break; // Early exit if any filter doesn't match
                    }
                }

                return matchesAll;
            });
        }

        // Apply search
        if (queueModalSearch) {
            const search = queueModalSearch.toLowerCase();
            filtered = filtered.filter(t =>
                (t.title || '').toLowerCase().includes(search) ||
                (t.rawTitle || '').toLowerCase().includes(search) ||
                (t.id || '').toLowerCase().includes(search) ||
                (t.prompt || '').toLowerCase().includes(search) ||
                (t.tags || '').toLowerCase().includes(search)
            );
        }

        return filtered;
    };

    // Performance mode toggle for automation runs
    let perfModeCount = 0;
    const setPerfMode = (on) => {
        if (on) {
            perfModeCount++;
            document.body.classList.add('suno-perf-mode');
        } else {
            perfModeCount = Math.max(0, perfModeCount - 1);
            if (perfModeCount === 0) document.body.classList.remove('suno-perf-mode');
        }
    };

    const applyOptimizeUI = () => {
        const panel = document.querySelector('.suno-panel');
        const enabled = GM_getValue(GM_KEYS.optimizeUI, false);
        if (panel) {
            panel.classList.toggle('suno-optimize-ui-mode', enabled);
        }
    };

    const applyBlurToggle = () => {
        const panel = document.querySelector('.suno-panel');
        const disabled = GM_getValue(GM_KEYS.disableBlur, false);
        if (panel) {
            panel.classList.toggle('suno-blur-off', disabled);
        }
    };

    const hideQueueModal = () => {
        if (queueModal) {
            queueModal.close();
        }
        // Also hide the overlay if it exists
        const queueOverlay = document.querySelector('.suno-modal-overlay[data-modal="queue"]');
        if (queueOverlay) {
            queueOverlay.classList.remove('visible');
        }
    };

    const showQueueModal = () => {
        // Clean up any stuck progress sections before showing modal
        const stuckProgressSection = document.getElementById('queue-modal-progress-section');
        if (stuckProgressSection && (!bulkDownloaderState.isFetching && !bulkDownloaderState.isDownloading)) {
            // No active process, hide progress section
            stuckProgressSection.style.display = 'none';
        }
        // Close existing modal if open
        if (queueModal) {
            queueModal.close();
        }

        const stats = getQueueStats();

        queueModal = new SunoModalBuilder('Download Queue Manager', {
            titleIcon: 'cloud-download',
            maxWidth: '95vw',
            draggable: false,
            showCloseButton: true,
            counter: stats.total
        });

        // Build content wrapper (same structure as Track Generation modal)
        const wrapper = createElement('div', { class: 'suno-track-modal-content suno-queue-modal-content' });

        // ============================================
        // TAB BAR (same as Track Generation)
        // ============================================
        const filterBar = createElement('div', { class: 'suno-track-filter-bar' });

        const tabsContainer = createElement('div', { class: 'suno-track-tabs' });
        const tabs = [
            { id: 'all', label: 'All', icon: 'list' },
            { id: 'pending', label: 'Pending', icon: 'time' },
            { id: 'completed', label: 'Completed', icon: 'checkmark-circle' },
            { id: 'failed', label: 'Failed', icon: 'close-circle' },
            { id: 'skipped', label: 'Skipped', icon: 'play-skip-forward' },
            { id: 'duplicates', label: 'Duplicates', icon: 'duplicate' },
            { id: 'unique', label: 'Unique', icon: 'checkmark-done' }
        ];

        const tabTooltips = {
            'all': 'View all tracks in queue',
            'pending': 'View tracks waiting to download',
            'completed': 'View successfully downloaded tracks',
            'failed': 'View tracks that failed to download',
            'skipped': 'View skipped tracks',
            'duplicates': 'View tracks marked as duplicates'
        };

        tabs.forEach(tab => {
            const btn = createElement('button', {
                class: `suno-tab-btn ${queueModalActiveFilters.has(tab.id) ? 'active' : ''}`,
                'data-filter': tab.id,
                'data-tooltip': tabTooltips[tab.id]
            });
            btn.appendChild(createIcon(tab.icon));
            btn.appendChild(createElement('span', { text: tab.label }));
            const countSpan = createElement('span', { class: 'suno-stat-value', id: `queue-tab-${tab.id}`, text: '0' });
            btn.appendChild(countSpan);

            // Toggle filter on click (supports multiple active filters)
            btn.addEventListener('click', () => {
                // If clicking 'all', clear all other filters and activate only 'all'
                if (tab.id === 'all') {
                    queueModalActiveFilters.clear();
                    queueModalActiveFilters.add('all');
                    tabsContainer.querySelectorAll('.suno-tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                } else {
                    // Remove 'all' if it's active (can't combine 'all' with specific filters)
                    if (queueModalActiveFilters.has('all')) {
                        queueModalActiveFilters.delete('all');
                        tabsContainer.querySelector('[data-filter="all"]')?.classList.remove('active');
                    }

                    // Toggle this filter
                    if (queueModalActiveFilters.has(tab.id)) {
                        queueModalActiveFilters.delete(tab.id);
                        btn.classList.remove('active');

                        // If no filters active, activate 'all'
                        if (queueModalActiveFilters.size === 0) {
                            queueModalActiveFilters.add('all');
                            tabsContainer.querySelector('[data-filter="all"]')?.classList.add('active');
                        }
                    } else {
                        queueModalActiveFilters.add(tab.id);
                        btn.classList.add('active');
                    }
                }

                // Update legacy filter for backward compatibility
                if (queueModalActiveFilters.size === 1 && queueModalActiveFilters.has('all')) {
                    queueModalFilter = 'all';
                } else if (queueModalActiveFilters.size === 1) {
                    queueModalFilter = Array.from(queueModalActiveFilters)[0];
                } else {
                    queueModalFilter = 'combined'; // Multiple filters active
                }

                updateQueueModalTable();
                updateQueueModalStats();
            });

            tabsContainer.appendChild(btn);
        });
        filterBar.appendChild(tabsContainer);

        // Search input (same as Track Generation)
        const searchContainer = createElement('div', { class: 'suno-track-search' });
        const searchInput = createElement('input', {
            type: 'text',
            placeholder: 'Search queue...',
            id: 'suno-queue-search-input',
            class: 'suno-input',
            'data-tooltip': 'Search by track name, ID, prompt, or tags'
        });
        searchInput.addEventListener('input', (e) => {
            queueModalSearch = e.target.value;
            updateQueueModalTable();
        });
        searchContainer.appendChild(createIcon('search'));
        searchContainer.appendChild(searchInput);
        filterBar.appendChild(searchContainer);

        // Toggle optional columns button
        const toggleOptionalBtn = createElement('button', {
            id: 'suno-queue-toggle-optional',
            class: 'suno-btn suno-btn-icon',
            'data-tooltip': 'Show/Hide optional columns'
        });
        toggleOptionalBtn.appendChild(createIcon(queueModalOptionalVisible ? 'eye' : 'eye-off', '16px'));
        toggleOptionalBtn.addEventListener('click', () => {
            queueModalOptionalVisible = !queueModalOptionalVisible;
            applyQueueModalOptionalColumns();
            updateIcon(toggleOptionalBtn, queueModalOptionalVisible ? 'eye' : 'eye-off');
        });
        filterBar.appendChild(toggleOptionalBtn);

        wrapper.appendChild(filterBar);

        // ============================================
        // QUEUE ACTIONS BAR (requested layout)
        // ============================================
        const queueActionsBar = createElement('div', {
            id: 'suno-queue-modal-actions-bar',
            class: 'suno-queue-actions-bar'
        });

        // Select all + stats + selected actions dropdown
        const selectAllContainer = createElement('div', { class: 'suno-select-all-container' });
        const selectAllLabel = createElement('label', { for: 'queue-modal-select-all' });
        const selectAllCheckbox = createElement('input', {
            type: 'checkbox',
            id: 'queue-modal-select-all',
            class: 'queue-select-all'
        });
        selectAllCheckbox.addEventListener('change', (e) => {
            const filtered = getFilteredQueueForModal();
            if (e.target.checked) {
                selectAllQueueTracks(filtered.map(t => t.id));
            } else {
                deselectAllQueueTracks();
            }
            updateQueueModalTable();
            updateQueueModalStats();
            updateSelectedActionsState();
        });
        selectAllLabel.appendChild(selectAllCheckbox);
        selectAllLabel.appendChild(document.createTextNode('Select All'));
        selectAllContainer.appendChild(selectAllLabel);

        const queueStatsContainer = createElement('div', { class: 'suno-queue-stats' });
        const statItems = [
            { key: 'total', label: 'Total', icon: 'list' },
            { key: 'selected', label: 'Selected', icon: 'checkbox' },
            { key: 'duplicates', label: 'Dupes', icon: 'duplicate' },
            { key: 'pending', label: 'Pending', icon: 'time' }
        ];
        statItems.forEach(item => {
            const stat = createElement('div', { class: 'suno-stat-item', 'data-stat': item.key });
            stat.appendChild(createIcon(item.icon, '12px'));
            stat.appendChild(createElement('span', { class: 'suno-stat-label', text: item.label + ':' }));
            stat.appendChild(createElement('span', { class: 'suno-stat-value', id: `queue-modal-stat-${item.key}`, text: '0' }));
            queueStatsContainer.appendChild(stat);
        });
        selectAllContainer.appendChild(queueStatsContainer);

        // Dropdown group for selected actions
        const actionsGroup = createElement('div', {
            class: 'suno-btn-group suno-selected-actions suno-button-row',
            role: 'group',
            'aria-label': 'Bulk Selection Actions Dropdown'
        });

        const dropdownTrigger = createElement('button', {
            class: 'dropdown-toggle suno-btn',
            id: 'queue-selected-actions-dropdown-title'
        });
        dropdownTrigger.appendChild(createElement('span', { text: 'Select Action' }));
        dropdownTrigger.appendChild(createIcon('play'));

        const dropdownMenu = createElement('div', {
            class: 'suno-dropdown-menu',
            id: 'queue-actions-dropdown-menu'
        });

        const refetchSelectedBtn = createElement('button', {
            class: 'suno-btn btn-info',
            id: 'queue-modal-refetch-selected-btn',
            'data-tooltip': 'Re-fetch selected tracks metadata'
        });
        refetchSelectedBtn.appendChild(createIcon('refresh'));
        refetchSelectedBtn.appendChild(createElement('span', { text: 'Re-Fetch Selected' }));
        refetchSelectedBtn.addEventListener('click', () => {
            refetchSelectedQueueTracks();
            dropdownMenu.classList.remove('show');
        });

        const downloadSelectedBtn = createElement('button', {
            class: 'suno-btn btn-success',
            id: 'queue-modal-download-selected-btn',
            'data-tooltip': 'Download selected tracks'
        });
        downloadSelectedBtn.appendChild(createIcon('download'));
        downloadSelectedBtn.appendChild(createElement('span', { text: 'Download Selected' }));
        downloadSelectedBtn.addEventListener('click', () => {
            downloadSelectedQueueTracks();
            dropdownMenu.classList.remove('show');
        });

        const removeSelectedBtn = createElement('button', {
            class: 'suno-btn btn-danger',
            id: 'queue-modal-remove-selected-btn',
            'data-tooltip': 'Remove selected tracks from queue'
        });
        removeSelectedBtn.appendChild(createIcon('trash'));
        removeSelectedBtn.appendChild(createElement('span', { text: 'Remove Selected' }));
        removeSelectedBtn.addEventListener('click', () => {
            removeSelectedQueueTracks();
            dropdownMenu.classList.remove('show');
        });

        dropdownMenu.appendChild(refetchSelectedBtn);
        dropdownMenu.appendChild(downloadSelectedBtn);
        dropdownMenu.appendChild(removeSelectedBtn);

        const dropdownResetBtn = createElement('button', {
            class: 'reset-btn suno-btn suno-btn-icon',
            'data-tooltip': 'Close menu'
        });
        dropdownResetBtn.appendChild(createIcon('close'));
        dropdownResetBtn.addEventListener('click', () => {
            dropdownMenu.classList.remove('show');
        });

        actionsGroup.appendChild(dropdownTrigger);
        actionsGroup.appendChild(dropdownMenu);
        actionsGroup.appendChild(dropdownResetBtn);

        selectAllContainer.appendChild(actionsGroup);
        queueActionsBar.appendChild(selectAllContainer);

        // Queue action buttons (right side)
        const queueBtnContainer = createElement('div', { class: 'suno-queue-buttons' });

        const batchGroup = createElement('div', { class: 'suno-btn-group', role: 'group', 'aria-label': 'Batch Process Control Buttons' });
        const pauseBtn = createElement('button', {
            class: 'btn-warning suno-btn suno-btn-icon',
            id: 'queue-modal-pause-btn',
            disabled: true,
            'data-tooltip': 'Pause/Resume Process'
        });
        pauseBtn.appendChild(createIcon('pause'));
        pauseBtn.appendChild(createElement('span', { text: 'Pause' }));
        pauseBtn.addEventListener('click', () => toggleQueueDownloadPause());

        const stopBtn = createElement('button', {
            class: 'btn-danger suno-btn suno-btn-icon',
            id: 'queue-modal-stop-btn',
            disabled: true,
            'data-tooltip': 'Stop Process'
        });
        stopBtn.appendChild(createIcon('stop'));
        stopBtn.appendChild(createElement('span', { text: 'Stop' }));
        stopBtn.addEventListener('click', () => stopQueueDownload());

        batchGroup.appendChild(pauseBtn);
        batchGroup.appendChild(stopBtn);

        const fetchBtn = createElement('button', {
            class: 'suno-btn btn-info',
            id: 'queue-modal-fetch-btn',
            'data-tooltip': 'Fetch tracks from current page'
        });
        fetchBtn.appendChild(createIcon('layers'));
        fetchBtn.appendChild(createElement('span', { text: 'Fetch Tracks' }));
        fetchBtn.addEventListener('click', () => startQueueFetch());

        const downloadAllBtn = createElement('button', {
            class: 'suno-btn btn-primary',
            id: 'queue-modal-download-all-btn',
            'data-tooltip': 'Download all pending tracks'
        });
        downloadAllBtn.appendChild(createIcon('cloud-download'));
        downloadAllBtn.appendChild(createElement('span', { text: 'Download All' }));
        downloadAllBtn.addEventListener('click', () => startQueueDownloadFromModal());

        const clearBtn = createElement('button', {
            class: 'suno-btn btn-danger',
            id: 'queue-modal-clear-btn',
            'data-tooltip': 'Clear entire queue'
        });
        clearBtn.appendChild(createIcon('trash'));
        clearBtn.appendChild(createElement('span', { text: 'Clear All' }));
        clearBtn.addEventListener('click', async () => {
            const confirmed = await toastManager.confirm('Clear entire fetch queue?');
            if (confirmed) {
                clearFetchQueue();
                updateQueueModalTable();
                updateQueueModalStats();
                toastManager.info('Queue cleared');
            }
        });

        queueBtnContainer.appendChild(batchGroup);
        queueBtnContainer.appendChild(fetchBtn);
        queueBtnContainer.appendChild(downloadAllBtn);
        queueBtnContainer.appendChild(clearBtn);
        queueActionsBar.appendChild(queueBtnContainer);

        wrapper.appendChild(queueActionsBar);

        // Wire dropdown interactions (bind after DOM ready)
        setTimeout(() => {
            bindSelectedActionsDropdown();
            updateSelectedActionsState();
        }, 0);

        // ============================================
        // PROGRESS BAR AND LOG
        // ============================================
        const progressSection = createElement('div', {
            id: 'queue-modal-progress-section',
            class: 'suno-queue-progress-section'
        });
        progressSection.style.display = 'none';

        const progressText = createElement('div', {
            id: 'queue-modal-progress-text',
            class: 'suno-queue-progress-header suno-queue-progress-text'
        });
        const progressTextLabel = createElement('span', {
            class: 'suno-queue-progress-label',
            text: ''
        });
        progressText.appendChild(progressTextLabel);
        // Foldable progress log toggle inside header
        const logContainer = createElement('div', { class: 'suno-queue-log-container' });
        const logToggle = createElement('button', {
            class: 'suno-btn suno-queue-log-toggle',
            'data-tooltip': 'Toggle progress log'
        });
        logToggle.appendChild(createIcon('chevron-up', '12px'));
        logToggle.appendChild(createElement('span', { text: 'Progress Log' }));
        logContainer.appendChild(logToggle);

        const progressClose = createElement('button', { class: 'suno-btn suno-btn-icon btn-sm', 'data-tooltip': 'Hide progress' });
        progressClose.appendChild(createIcon('close', '12px'));
        progressClose.addEventListener('click', () => {
            hideQueueProgress();
        });

        progressText.appendChild(logContainer);
        progressText.appendChild(progressClose);
        progressSection.appendChild(progressText);

        const progressBar = createElement('div', { class: 'suno-queue-progress', id: 'queue-modal-progress-bar' });
        progressBar.appendChild(createElement('div', { class: 'suno-queue-progress-fill', id: 'queue-modal-progress-fill' }));
        progressSection.appendChild(progressBar);

        const logContent = createElement('div', {
            id: 'queue-modal-log',
            class: 'suno-queue-log'
        });
        progressSection.appendChild(logContent);

        logToggle.addEventListener('click', () => {
            logContent.classList.toggle('collapsed');
            updateIcon(logToggle, logContent.classList.contains('collapsed') ? 'chevron-down' : 'chevron-up');
        });

        wrapper.appendChild(progressSection);

        // ============================================
        // TABLE
        // ============================================
        const tableScroll = createElement('div', {
            id: 'suno-queue-modal-table-scroll',
            class: 'suno-table-scroll'
        });

        const table = createElement('table', { class: 'suno-table', id: 'suno-queue-modal-table' });
        const thead = createElement('thead');
        const headerRow = createElement('tr');

        const headers = [
            { key: 'select', text: '', sortable: false },
            { key: 'index', text: '#', sortable: true },
            { key: 'thumbnail', text: 'Img', sortable: false },
            { key: 'title', text: 'Title', sortable: true },
            { key: 'duration', text: 'Duration', sortable: true },
            { key: 'created', text: 'Created', sortable: true, optional: true },
            { key: 'prompt', text: 'Prompt', sortable: false, optional: true },
            { key: 'dedupe', text: 'Dedupe', sortable: true },
            { key: 'status', text: 'Status', sortable: true },
            { key: 'actions', text: 'Actions', sortable: false }
        ];

        headers.forEach(h => {
            const th = createElement('th', {
                text: h.text,
                class: h.optional ? 'optional-column' : ''
            });
            // Add mimic select-all checkbox into header cell for selection column
            if (h.key === 'select') {
                th.textContent = '';
                const mimicSelectAll = createElement('input', {
                    type: 'checkbox',
                    id: 'queue-modal-select-all-mimic',
                    class: 'queue-select-all queue-select-all-mimic'
                });
                mimicSelectAll.addEventListener('change', () => {
                    const mainSelectAll = document.getElementById('queue-modal-select-all');
                    if (mainSelectAll) {
                        mainSelectAll.checked = mimicSelectAll.checked;
                        mainSelectAll.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });
                th.appendChild(mimicSelectAll);
            }
            if (h.sortable) {
                th.classList.add('sortable');
                th.dataset.sortKey = h.key;
            }
            // Respect current optional columns visibility state
            if (h.optional && !queueModalOptionalVisible) th.style.display = 'none';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        table.appendChild(createElement('tbody', { id: 'queue-modal-tbody' }));

        tableScroll.appendChild(table);
        wrapper.appendChild(tableScroll);

        // Empty state
        const emptyMsg = createElement('div', {
            id: 'queue-modal-empty',
            class: 'suno-track-empty'
        });
        emptyMsg.appendChild(createIcon('cloud-download-outline', '48px'));
        emptyMsg.appendChild(createElement('p', {
            text: 'No tracks in queue. Use "Fetch" to load tracks from the current page.'
        }));
        emptyMsg.style.display = 'none';
        wrapper.appendChild(emptyMsg);

        queueModal.setContent(wrapper);

        // ============================================
        // BOTTOM ACTION BUTTONS
        // ============================================
        queueModal.addButtons([
            {
                text: 'Track History',
                icon: 'musical-notes',
                classes: ['suno-btn', 'btn-info'],
                position: 'right',
                tooltip: 'Go to Track Generation & Download History',
                onClick: () => {
                    queueModal.close();
                    showTrackTableModal();
                }
            },
            {
                text: 'Check Duplicates',
                icon: 'search',
                classes: ['suno-btn'],
                position: 'right',
                tooltip: 'Compare with local files',
                onClick: () => {
                    queueModal.close();
                    showDuplicateCheckModal();
                }
            },
            {
                text: 'Export CSV',
                icon: 'fileExport',
                classes: ['suno-btn'],
                position: 'right',
                tooltip: 'Export queue to CSV',
                onClick: () => exportQueueCSV()
            },
            {
                text: 'Close',
                icon: 'xmark',
                classes: ['suno-btn', 'btn-danger'],
                position: 'left',
                onClick: () => queueModal.close()
            }
        ]);

        // Mark modal for identification
        const overlay = queueModal.getOverlay();
        overlay.setAttribute('data-modal', 'queue');

        queueModal.show();

        // CRITICAL: Hydrate modal with current state when opened
        hydrateQueueModalState();
        hydrateQueueModalLog();
        updateQueueProcessControls();

        // Initial table populate
        updateQueueModalTable();
        updateQueueModalStats();
        updateQueueModalTabCounts();

        // Initialize table sorter for queue modal table
        requestAnimationFrame(() => {
            setTimeout(() => {
                const table = document.getElementById('suno-queue-modal-table');
                if (table && table.isConnected && table.querySelector('thead') && table.querySelector('tbody')) {
                    try {
                        ensureTableSorter(table);
                    } catch (e) {
                        console.warn('Failed to initialize TableSorter for queue modal table:', e);
                    }
                }
            }, 150);
        });
    };

    // Hydrate modal with current bulk downloader state
    const hydrateQueueModalState = () => {
        const progressSection = document.getElementById('queue-modal-progress-section');
        const progressText = document.getElementById('queue-modal-progress-text');

        // Show progress section if there's an active or paused process
        if (bulkDownloaderState.isFetching || bulkDownloaderState.isDownloading) {
            if (progressSection) progressSection.style.display = 'block';

            if (progressText) {
                const label = progressText.querySelector('.suno-queue-progress-label');
                let message = '';

                if (bulkDownloaderState.isPaused) {
                    if (bulkDownloaderState.isDownloading) {
                        message = `Paused. Downloading ${bulkDownloaderState.download.downloaded}/${bulkDownloaderState.download.total}...`;
                    } else if (bulkDownloaderState.isFetching) {
                        message = `Paused. ${bulkDownloaderState.fetch.allSongs.size} songs collected.`;
                    }
                } else if (bulkDownloaderState.isStopped) {
                    if (bulkDownloaderState.isDownloading) {
                        message = `Stopped. Downloaded ${bulkDownloaderState.download.downloaded}/${bulkDownloaderState.download.total}.`;
                    } else {
                        message = `Stopped. ${bulkDownloaderState.fetch.allSongs.size} songs collected.`;
                    }
                } else if (bulkDownloaderState.isFetching) {
                    message = `Fetching... ${bulkDownloaderState.fetch.allSongs.size} songs collected.`;
                } else if (bulkDownloaderState.isDownloading) {
                    message = `Downloading ${bulkDownloaderState.download.downloaded}/${bulkDownloaderState.download.total}...`;
                }

                if (label && message) {
                    label.textContent = message;
                } else if (message) {
                    progressText.textContent = message;
                }
            }
        } else {
            // No active process, hide progress section
            if (progressSection) progressSection.style.display = 'none';
        }
    };

    // Update tab counts
    const updateQueueModalTabCounts = () => {
        const stats = getQueueStats();
        const counts = {
            all: fetchQueue.length,
            pending: stats.pending,
            completed: stats.completed,
            failed: stats.failed,
            skipped: fetchQueue.filter(t => t.queueStatus === 'skipped').length,
            duplicates: stats.duplicates,
            unique: fetchQueue.filter(t => !t.isDuplicate).length
        };

        Object.entries(counts).forEach(([key, value]) => {
            const el = document.getElementById(`queue-tab-${key}`);
            const btn = el?.closest('.suno-tab-btn');
            if (el) {
                el.textContent = value.toString();
                // Disable button if count is zero
                if (btn) {
                    btn.disabled = value === 0;
                    btn.classList.toggle('disabled', value === 0);
                    if (value === 0 && queueModalActiveFilters.has(key) && key !== 'all') {
                        // If active filter has zero results, deactivate it and activate 'all'
                        queueModalActiveFilters.delete(key);
                        btn.classList.remove('active');
                        if (queueModalActiveFilters.size === 0) {
                            queueModalActiveFilters.add('all');
                            const allBtn = document.querySelector('[data-filter="all"]');
                            if (allBtn) allBtn.classList.add('active');
                        }
                    }
                }
            }
        });
    };

    // Update stats display
    const updateQueueModalStats = () => {
        const stats = getQueueStats();

        const updateEl = (key, value) => {
            const el = document.getElementById(`queue-modal-stat-${key}`);
            if (el) el.textContent = value.toString();
        };

        updateEl('total', fetchQueue.length);
        updateEl('selected', queueSelection.size);
        updateEl('duplicates', stats.duplicates);
        updateEl('pending', stats.pending);

        // Update tab counts
        updateQueueModalTabCounts();

        // Update progress bar if downloading
        const progressFill = document.getElementById('queue-modal-progress-fill');
        const processed = stats.completed + stats.failed + fetchQueue.filter(t => t.queueStatus === 'skipped').length;
        if (progressFill && queueModalState.totalToDownload > 0) {
            const percent = (queueModalState.currentIndex / queueModalState.totalToDownload) * 100;
            progressFill.style.width = Math.min(percent, 100) + '%';
        } else if (progressFill && fetchQueue.length > 0) {
            const percent = (processed / fetchQueue.length) * 100;
            progressFill.style.width = percent + '%';
        }

        // Update select all checkbox state
        const selectAll = document.getElementById('queue-modal-select-all');
        const selectAllMimic = document.getElementById('queue-modal-select-all-mimic');
        if (selectAll) {
            const filtered = getFilteredQueueForModal();
            selectAll.checked = filtered.length > 0 && filtered.every(t => queueSelection.has(t.id));
            selectAll.indeterminate = filtered.some(t => queueSelection.has(t.id)) &&
                !filtered.every(t => queueSelection.has(t.id));
        }
        if (selectAllMimic) {
            const filtered = getFilteredQueueForModal();
            selectAllMimic.checked = filtered.length > 0 && filtered.every(t => queueSelection.has(t.id));
            selectAllMimic.indeterminate = filtered.some(t => queueSelection.has(t.id)) &&
                !filtered.every(t => queueSelection.has(t.id));
        }
    };

    // Update table display
    const updateQueueModalTable = () => {
        const tbody = document.getElementById('queue-modal-tbody');
        const emptyMsg = document.getElementById('queue-modal-empty');
        if (!tbody) return;

        tbody.textContent = '';

        const filtered = getFilteredQueueForModal();

        // Show/hide empty state
        if (emptyMsg) {
            emptyMsg.style.display = filtered.length === 0 ? 'block' : 'none';
        }

        // Limit display for performance
        const displayLimit = 300;
        const tracks = filtered.slice(0, displayLimit);

        tracks.forEach((track, idx) => {
            const row = createElement('tr', {
                class: `${track.queueStatus || ''} ${queueSelection.has(track.id) ? 'selected' : ''}`,
                'data-track-id': track.id
            });

            // Checkbox
            const checkCell = createElement('td');
            const checkbox = createElement('input', {
                type: 'checkbox',
                class: 'queue-row-checkbox'
            });
            checkbox.checked = queueSelection.has(track.id);
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                if (e.target.checked) {
                    selectQueueTrack(track.id);
                } else {
                    deselectQueueTrack(track.id);
                }
                row.classList.toggle('selected', e.target.checked);
                updateQueueModalStats();
                updateSelectedActionsState();
            });
            checkCell.appendChild(checkbox);
            row.appendChild(checkCell);

            // Index
            row.appendChild(createElement('td', { text: (idx + 1).toString() }));

            // Thumbnail (lazy load with lightbox)
            const imgCell = createElement('td', { class: 'thumbnail-cell' });
            const imgUrl = track.thumbnailUrl || `https://cdn2.suno.ai/image_${track.id}.jpeg`;
            const fullImgUrl = imgUrl.replace('?width=100', ''); // Full size for lightbox
            const imgPlaceholder = createElement('div', {
                class: 'suno-queue-img-placeholder',
                'data-img-url': imgUrl,
                'data-full-url': fullImgUrl,
                text: '📷'
            });
            imgPlaceholder.addEventListener('click', (e) => {
                e.stopPropagation();
                const url = e.target.getAttribute('data-img-url');
                const fullUrl = e.target.getAttribute('data-full-url') || url;
                if (url) {
                    // Create lightbox anchor wrapper
                    const anchor = createElement('a', {
                        href: fullUrl,
                        class: 'suno-lightbox',
                        'data-tooltip': 'Click to view full image'
                    });
                    const img = createElement('img', {
                        src: url,
                        class: 'suno-queue-img-loaded'
                    });
                    img.onerror = () => handleImageError(img, url);
                    anchor.appendChild(img);
                    e.target.replaceWith(anchor);
                }
            });
            imgCell.appendChild(imgPlaceholder);
            row.appendChild(imgCell);

            // Title
            const titleCell = createElement('td', { class: 'title-cell' });
            titleCell.textContent = track.rawTitle || track.title || 'Unknown';
            titleCell.title = track.rawTitle || track.title || '';
            row.appendChild(titleCell);

            // Duration
            row.appendChild(createElement('td', { text: track.duration || '--:--' }));

            // Created (optional) - respect state
            const createdCell = createElement('td', { class: 'optional-column' });
            createdCell.textContent = track.createdAt ? new Date(track.createdAt).toLocaleDateString() : '-';
            if (!queueModalOptionalVisible) createdCell.style.display = 'none';
            row.appendChild(createdCell);

            // Prompt (optional) - respect state
            const promptCell = createElement('td', { class: 'optional-column' });
            promptCell.textContent = track.prompt || '-';
            promptCell.title = track.prompt || '';
            if (!queueModalOptionalVisible) promptCell.style.display = 'none';
            row.appendChild(promptCell);

            // Dedupe status
            const dedupeCell = createElement('td');
            const dedupeStatus = track.isDuplicate ? 'DUPLICATE' : 'UNIQUE';
            dedupeCell.appendChild(createElement('span', {
                class: `suno-queue-status ${track.isDuplicate ? 'skipped' : 'unique'}`,
                text: dedupeStatus
            }));
            row.appendChild(dedupeCell);

            // Status
            const statusCell = createElement('td');
            const status = track.queueStatus || 'pending';
            statusCell.appendChild(createElement('span', {
                class: `suno-queue-status ${status}`,
                text: status.toUpperCase()
            }));
            row.appendChild(statusCell);

            // Actions
            const actionsCell = createElement('td', { class: 'actions-cell' });

            // Download button
            const downloadBtn = createElement('button', {
                class: 'suno-btn btn-sm btn-success',
                title: 'Download this track'
            });
            downloadBtn.appendChild(createIcon('download', '12px'));
            downloadBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                await downloadSingleQueueTrack(track);
            });
            actionsCell.appendChild(downloadBtn);

            // Remove button
            const removeBtn = createElement('button', {
                class: 'suno-btn btn-sm btn-danger',
                title: 'Remove from queue'
            });
            removeBtn.appendChild(createIcon('trash', '12px'));
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromFetchQueue(track.id);
                row.remove();
                updateQueueModalStats();
            });
            actionsCell.appendChild(removeBtn);

            row.appendChild(actionsCell);

            // Row click to toggle selection
            row.addEventListener('click', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
                toggleQueueTrackSelection(track.id);
                row.classList.toggle('selected', queueSelection.has(track.id));
                const cb = row.querySelector('.queue-row-checkbox');
                if (cb) cb.checked = queueSelection.has(track.id);
                updateQueueModalStats();
            });

            tbody.appendChild(row);
        });

        // Truncation message
        if (filtered.length > displayLimit) {
            const row = createElement('tr');
            const td = createElement('td', { text: `... and ${filtered.length - displayLimit} more tracks (use search/filters to narrow down)` });
            td.setAttribute('colspan', '10');
            td.style.textAlign = 'center';
            td.style.color = 'var(--suno-text-secondary)';
            row.appendChild(td);
            tbody.appendChild(row);
        }

        // Auto-scroll to latest processed item if downloading
        if (bulkDownloaderState.isDownloading && tracks.length > 0) {
            setTimeout(() => {
                const tableScroll = document.getElementById('suno-queue-modal-table-scroll');
                if (tableScroll && tbody) {
                    const rows = Array.from(tbody.querySelectorAll('tr'));
                    if (rows.length > 0) {
                        // Find last completed row
                        let scrollToRow = null;
                        for (let i = rows.length - 1; i >= 0; i--) {
                            const row = rows[i];
                            const status = row.classList.contains('completed') ||
                                row.querySelector('.suno-queue-status.completed');
                            if (status) {
                                scrollToRow = row;
                                break;
                            }
                        }

                        // If no completed row found, find last downloading row
                        if (!scrollToRow) {
                            for (let i = rows.length - 1; i >= 0; i--) {
                                const row = rows[i];
                                const status = row.classList.contains('downloading') ||
                                    row.querySelector('.suno-queue-status.downloading');
                                if (status) {
                                    scrollToRow = row;
                                    break;
                                }
                            }
                        }

                        // Scroll to the row, centering it vertically
                        if (scrollToRow) {
                            scrollToRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        } else if (rows.length > 0) {
                            // Fallback: scroll to last row
                            rows[rows.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }
                }
            }, 100);
        }
    };

    // Add log entry
    const addQueueModalLogEntry = (message, type = 'info') => {
        const entry = { time: Date.now(), message, type };
        queueModalState.downloadLog.push(entry);
        if (queueModalState.downloadLog.length > QUEUE_LOG_LIMIT) {
            queueModalState.downloadLog.shift();
        }
        renderQueueModalLogEntryFromState(entry);
    };

    // Download single track
    const downloadSingleQueueTrack = async (track) => {
        if (!track.url) {
            toastManager.warning('No download URL for this track');
            return;
        }

        updateQueueTrackStatus(track.id, 'downloading');
        updateQueueModalTable();

        try {
            if (typeof GM_download !== 'undefined') {
                GM_download({
                    url: track.url,
                    name: track.filename || track.title + '.mp3',
                    saveAs: false
                });
            } else {
                window.open(track.url, '_blank');
            }

            updateQueueTrackStatus(track.id, 'completed', { downloadedAt: Date.now() });
            addToDownloadLog(track);
            addToDownloadedMatches({
                id: track.id,
                filename: track.filename || track.title + '.mp3',
                duration: track.duration,
                downloadedAt: Date.now()
            });
            toastManager.success(`Downloaded: ${track.title || track.id}`);
        } catch (e) {
            updateQueueTrackStatus(track.id, 'failed', { error: e.message });
            toastManager.error(`Failed to download: ${e.message}`);
        }

        updateQueueModalTable();
        updateQueueModalStats();
    };

    // Download selected tracks from modal
    const downloadSelectedFromModal = async () => {
        const selectedTracks = fetchQueue.filter(t => queueSelection.has(t.id) && t.queueStatus !== 'completed');

        if (selectedTracks.length === 0) {
            toastManager.warning('No tracks selected for download');
            return;
        }

        const confirmed = await toastManager.confirm(`Download ${selectedTracks.length} selected track(s)?`);
        if (!confirmed) return;

        await startQueueDownloadProcess(selectedTracks);
    };

    // Start download from modal (all pending)
    const startQueueDownloadFromModal = async () => {
        const pendingTracks = fetchQueue.filter(t =>
            (t.queueStatus === 'pending' || !t.queueStatus) && !t.isDuplicate
        );

        if (pendingTracks.length === 0) {
            toastManager.warning('No pending tracks to download');
            return;
        }

        const dupeCount = fetchQueue.filter(t => t.isDuplicate).length;

        // Show confirmation immediately BEFORE starting any process
        const confirmed = await toastManager.confirm(
            `Download ${pendingTracks.length} track(s)?\n(${dupeCount} duplicates will be skipped)`,
            {
                title: 'Confirm Download',
                confirmText: 'Download All',
                cancelText: 'Cancel'
            }
        );

        if (!confirmed) {
            return; // User cancelled, do nothing
        }

        // Only proceed after explicit confirmation
        await startQueueDownloadProcess(pendingTracks);
    };

    // Main download process
    const startQueueDownloadProcess = async (tracks) => {
        if (tracks.length === 0) return;

        // Close modal automatically when download starts (user preference: auto-close)
        const queueOverlay = document.querySelector('.suno-modal-overlay[data-modal="queue"]');
        if (queueOverlay && queueOverlay.classList.contains('visible')) {
            hideQueueModal();
        }

        const downloadTrack = (track) => {
            return new Promise((resolve, reject) => {
                if (!track.url) {
                    reject(new Error('No URL'));
                    return;
                }

                // If GM_download is available, run sequentially and resolve on completion
                if (typeof GM_download !== 'undefined') {
                    GM_download({
                        url: track.url,
                        name: track.filename || `${track.title || track.id}.mp3`,
                        saveAs: false,
                        timeout: 120000,
                        onload: () => resolve(true),
                        ontimeout: () => reject(new Error('Download timeout')),
                        onerror: (err) => reject(new Error(err?.error || 'Download failed'))
                    });
                } else {
                    // Fallback: open in new tab (no reliable completion signal)
                    window.open(track.url, '_blank');
                    resolve(true);
                }
            });
        };

        // Update unified state
        bulkDownloaderState.isDownloading = true;
        bulkDownloaderState.isPaused = false;
        bulkDownloaderState.isStopped = false;
        bulkDownloaderState.activeProcess = 'download';
        bulkDownloaderState.download.tracks = tracks;
        bulkDownloaderState.download.total = tracks.length;
        bulkDownloaderState.download.currentIndex = 0;
        bulkDownloaderState.download.downloaded = 0;
        bulkDownloaderState.download.failed = 0;
        bulkDownloaderState.download.skipped = 0;
        bulkDownloaderState.download.duplicateConfirmed = false; // Reset duplicate confirmation
        saveFetchQueue();

        // Create/update progress card and make it visible
        createProgressCard('bulk');
        const card = document.querySelector('#suno-progress-card');
        if (card) {
            card.classList.add('visible');
            // Enable pause/stop buttons
            const cardPause = card.querySelector('#suno-progress-bulk-pause');
            const cardStop = card.querySelector('#suno-progress-bulk-stop');
            if (cardPause) cardPause.disabled = false;
            if (cardStop) cardStop.disabled = false;
        }
        updateProgressCard({
            downloads: 0,
            downloadLimit: tracks.length,
            pending: tracks.length,
            tracks: fetchQueue.length || tracks.length,
            isPaused: false,
            isStopped: false,
            source: getCurrentFetchSource(),
            currentTrack: 'Starting...'
        }, 'bulk');
        setPerfMode(true);
        BulkLogger.info(`Starting download of ${tracks.length} tracks...`);

        let downloaded = 0, failed = 0, skipped = 0;

        for (let i = 0; i < tracks.length; i++) {
            // Check stop
            if (!bulkDownloaderState.isDownloading || bulkDownloaderState.isStopped) {
                BulkLogger.warn('Download stopped by user');
                break;
            }

            // Check pause - CRITICAL: Update UI once when entering pause, then wait without updates
            if (bulkDownloaderState.isPaused && bulkDownloaderState.isDownloading && !bulkDownloaderState.isStopped) {
                // Update once to show paused state
                updateProgressCard({
                    downloads: downloaded,
                    downloadLimit: tracks.length,
                    pending: tracks.length - (downloaded + failed + skipped),
                    tracks: fetchQueue.length || tracks.length,
                    isPaused: true,
                    isStopped: false,
                    source: getCurrentFetchSource()
                }, 'bulk');
            }

            // Wait in pause loop WITHOUT updating UI (prevents constant DOM mutations)
            while (bulkDownloaderState.isPaused && bulkDownloaderState.isDownloading && !bulkDownloaderState.isStopped) {
                await responsiveSleep(250, () => bulkDownloaderState.isDownloading && !bulkDownloaderState.isStopped);
            }
            if (!bulkDownloaderState.isDownloading || bulkDownloaderState.isStopped) break;

            const track = tracks[i];
            bulkDownloaderState.download.currentIndex = i + 1;
            saveFetchQueue();

            // Update progress card with current track name
            const currentTrackName = track.title || track.id || 'Unknown';
            updateProgressCard({
                downloads: downloaded,
                downloadLimit: tracks.length,
                pending: tracks.length - (downloaded + failed + skipped),
                tracks: fetchQueue.length || tracks.length,
                isPaused: false,
                isStopped: false,
                source: getCurrentFetchSource(),
                currentTrack: currentTrackName
            }, 'bulk');

            BulkLogger.info(`Downloading ${i + 1}/${tracks.length}: ${currentTrackName}`);

            // Check if already in no-duple list
            if (isTrackInDownloadedMatches(track.id)) {
                // Check if user wants to re-download duplicates
                // Only ask once at the start if there are duplicates
                if (i === 0 || (i > 0 && !bulkDownloaderState.download.duplicateConfirmed)) {
                    const duplicateTracks = tracks.filter(t => isTrackInDownloadedMatches(t.id));
                    if (duplicateTracks.length > 0 && !bulkDownloaderState.download.duplicateConfirmed) {
                        const confirmed = await toastManager.confirm(
                            `${duplicateTracks.length} track(s) were already downloaded before. Download again?`,
                            {
                                title: 'Duplicate Tracks Detected',
                                confirmText: 'Download Again',
                                cancelText: 'Skip Duplicates'
                            }
                        );
                        bulkDownloaderState.download.duplicateConfirmed = confirmed;
                        if (!confirmed) {
                            BulkLogger.info(`User chose to skip ${duplicateTracks.length} duplicate(s)`);
                        }
                    }
                }

                // Skip if user chose not to re-download
                if (!bulkDownloaderState.download.duplicateConfirmed) {
                    skipped++;
                    bulkDownloaderState.download.skipped = skipped;
                    updateQueueTrackStatus(track.id, 'skipped', { reason: 'Already downloaded (user skipped)' });
                    BulkLogger.info(`Skipped (already downloaded): ${track.title}`);
                    continue;
                } else {
                    BulkLogger.info(`Re-downloading duplicate: ${track.title}`);
                }
            }

            updateQueueTrackStatus(track.id, 'downloading');

            // Update queue modal table to show downloading status and scroll to active row
            const queueOverlay = document.querySelector('.suno-modal-overlay[data-modal="queue"]');
            if (queueOverlay && queueOverlay.classList.contains('visible')) {
                updateQueueModalTable();
            }

            try {
                await downloadTrack(track);
                downloaded++;
                bulkDownloaderState.download.downloaded = downloaded;
                updateQueueTrackStatus(track.id, 'completed', { downloadedAt: Date.now() });
                addToDownloadLog(track);
                addToDownloadedMatches({
                    id: track.id,
                    filename: track.filename || track.title + '.mp3',
                    duration: track.duration,
                    downloadedAt: Date.now()
                });
                BulkLogger.info(`Downloaded: ${track.title}`);

                // Update queue modal table to show completed status and scroll to completed row
                if (queueOverlay && queueOverlay.classList.contains('visible')) {
                    updateQueueModalTable();
                }
            } catch (e) {
                failed++;
                bulkDownloaderState.download.failed = failed;
                updateQueueTrackStatus(track.id, 'failed', { error: e.message });
                BulkLogger.error(`Error: ${track.title} - ${e.message}`);

                // Update queue modal table to show failed status
                const queueOverlay = document.querySelector('.suno-modal-overlay[data-modal="queue"]');
                if (queueOverlay && queueOverlay.classList.contains('visible')) {
                    updateQueueModalTable();
                }
            }

            // Update progress card after each download
            updateProgressCard({
                downloads: downloaded,
                downloadLimit: tracks.length,
                pending: tracks.length - (downloaded + failed + skipped),
                tracks: fetchQueue.length || tracks.length,
                isPaused: false,
                isStopped: false,
                source: getCurrentFetchSource()
            }, 'bulk');

            // Yield to UI; respect stop flag
            if (!bulkDownloaderState.isDownloading || bulkDownloaderState.isStopped) break;
            await responsiveSleep(150, () => bulkDownloaderState.isDownloading && !bulkDownloaderState.isStopped);
        }

        // Complete
        bulkDownloaderState.isDownloading = false;
        bulkDownloaderState.isPaused = false;
        bulkDownloaderState.isStopped = true;
        bulkDownloaderState.activeProcess = null;
        saveFetchQueue();

        const completionMsg = `Download complete! ${downloaded} succeeded, ${failed} failed, ${skipped} skipped`;
        BulkLogger.info(completionMsg);
        toastManager.success(completionMsg);

        updateProgressCard({
            downloads: downloaded,
            downloadLimit: tracks.length,
            pending: tracks.length - (downloaded + failed + skipped),
            tracks: fetchQueue.length || tracks.length,
            isPaused: false,
            isStopped: true,
            source: getCurrentFetchSource()
        }, 'bulk');
        setPerfMode(false);

        // Update card buttons to disabled state
        const cardPause = document.getElementById('suno-progress-bulk-pause');
        const cardStop = document.getElementById('suno-progress-bulk-stop');
        if (cardPause) cardPause.disabled = true;
        if (cardStop) cardStop.disabled = true;
    };

    // Pause/Resume
    const toggleQueueDownloadPause = () => {
        // Check if fetch is active
        if (bulkDownloaderState.activeProcess === 'fetch' && bulkDownloaderState.isFetching) {
            bulkDownloaderState.isPaused = !bulkDownloaderState.isPaused;
            saveFetchQueue();

            const pauseBtn = document.getElementById('queue-modal-pause-btn');
            const bulkPause = document.getElementById('suno-bulk-pause');
            const cardPause = document.getElementById('suno-progress-bulk-pause');
            [pauseBtn, bulkPause, cardPause].forEach(btn => {
                if (!btn) return;
                const span = btn.querySelector('span');
                updateIcon(btn, bulkDownloaderState.isPaused ? 'play' : 'pause');
                if (span) span.textContent = bulkDownloaderState.isPaused ? 'Resume' : 'Pause';
            });

            BulkLogger.info(bulkDownloaderState.isPaused ? 'Fetch paused' : 'Fetch resumed');

            updateProgressCard({
                downloads: 0,
                downloadLimit: 0,
                pending: fetchQueue.length,
                tracks: bulkDownloaderState.fetch.allSongs.size,
                isPaused: bulkDownloaderState.isPaused,
                isStopped: false,
                source: bulkDownloaderState.fetch.source
            }, 'bulk');
            return;
        }

        // Download pause/resume
        if (bulkDownloaderState.activeProcess === 'download' && bulkDownloaderState.isDownloading) {
            const wasPaused = bulkDownloaderState.isPaused;
            bulkDownloaderState.isPaused = !bulkDownloaderState.isPaused;
            saveFetchQueue();

            const pauseBtn = document.getElementById('queue-modal-pause-btn');
            const cardPause = document.getElementById('suno-progress-bulk-pause');
            [pauseBtn, cardPause].forEach(btn => {
                if (!btn) return;
                const span = btn.querySelector('span');
                updateIcon(btn, bulkDownloaderState.isPaused ? 'play' : 'pause');
                if (span) span.textContent = bulkDownloaderState.isPaused ? 'Resume' : 'Pause';
            });

            BulkLogger.info(bulkDownloaderState.isPaused ? 'Download paused' : 'Download resumed');

            // CRITICAL: Update UI once when resuming (not repeatedly)
            if (!wasPaused && bulkDownloaderState.isPaused) {
                // Just paused - update once
                updateProgressCard({
                    downloads: bulkDownloaderState.download.downloaded,
                    downloadLimit: bulkDownloaderState.download.total,
                    pending: bulkDownloaderState.download.total - (bulkDownloaderState.download.downloaded + bulkDownloaderState.download.failed + bulkDownloaderState.download.skipped),
                    tracks: fetchQueue.length || bulkDownloaderState.download.total,
                    isPaused: true,
                    isStopped: false,
                    source: getCurrentFetchSource()
                }, 'bulk');
            } else if (wasPaused && !bulkDownloaderState.isPaused) {
                // Just resumed - update UI and optionally close modal
                updateProgressCard({
                    downloads: bulkDownloaderState.download.downloaded,
                    downloadLimit: bulkDownloaderState.download.total,
                    pending: bulkDownloaderState.download.total - (bulkDownloaderState.download.downloaded + bulkDownloaderState.download.failed + bulkDownloaderState.download.skipped),
                    tracks: fetchQueue.length || bulkDownloaderState.download.total,
                    isPaused: false,
                    isStopped: false,
                    source: getCurrentFetchSource()
                }, 'bulk');

                // Optionally close modal when resuming (user preference)
                const queueOverlay = document.querySelector('.suno-modal-overlay[data-modal="queue"]');
                if (queueOverlay && queueOverlay.classList.contains('visible')) {
                    // Keep modal open but ensure it shows current state
                    hydrateQueueModalState();
                }
            }
        }
    };

    // Stop
    const stopQueueDownload = () => {
        // Check if fetch is active
        if (bulkDownloaderState.activeProcess === 'fetch' && bulkDownloaderState.isFetching) {
            bulkDownloaderState.isStopped = true;
            bulkDownloaderState.isFetching = false;
            bulkDownloaderState.isPaused = false;
            bulkDownloaderState.activeProcess = null;
            saveFetchQueue();

            BulkLogger.warn('Fetch stopped by user');

            // Update UI buttons
            const fetchAllBtn = document.getElementById('suno-bulk-all');
            if (fetchAllBtn) fetchAllBtn.disabled = false;
            const bulkPauseBtn = document.getElementById('suno-bulk-pause');
            if (bulkPauseBtn) {
                bulkPauseBtn.disabled = true;
                updateIcon(bulkPauseBtn, 'pause');
                const span = bulkPauseBtn.querySelector('span');
                if (span) span.textContent = 'Pause';
            }
            const bulkStopBtn = document.getElementById('suno-bulk-stop');
            if (bulkStopBtn) bulkStopBtn.disabled = true;

            updateProgressCard({
                downloads: 0,
                downloadLimit: 0,
                pending: fetchQueue.length,
                tracks: bulkDownloaderState.fetch.allSongs.size,
                isPaused: false,
                isStopped: true,
                source: bulkDownloaderState.fetch.source
            }, 'bulk');
            setPerfMode(false);
            return;
        }

        // Stop download
        if (bulkDownloaderState.activeProcess === 'download' && bulkDownloaderState.isDownloading) {
            bulkDownloaderState.isStopped = true;
            bulkDownloaderState.isDownloading = false;
            bulkDownloaderState.isPaused = false;
            bulkDownloaderState.activeProcess = null;
            saveFetchQueue();

            BulkLogger.warn('Download stopped by user');

            updateProgressCard({
                downloads: bulkDownloaderState.download.downloaded,
                downloadLimit: bulkDownloaderState.download.total,
                pending: bulkDownloaderState.download.total - (bulkDownloaderState.download.downloaded + bulkDownloaderState.download.failed + bulkDownloaderState.download.skipped),
                tracks: fetchQueue.length || bulkDownloaderState.download.total,
                isPaused: false,
                isStopped: true,
                source: getCurrentFetchSource()
            }, 'bulk');
            setPerfMode(false);

            toastManager.info('Download stopped');
        }
    };

    // Export queue as CSV
    const exportQueueCSV = () => {
        if (fetchQueue.length === 0) {
            toastManager.warning('Queue is empty');
            return;
        }

        const headers = ['ID', 'Title', 'Duration', 'Status', 'Is Duplicate', 'URL', 'Created At', 'Downloaded At'];
        const rows = fetchQueue.map(t => [
            t.id,
            t.rawTitle || t.title || '',
            t.duration || '',
            t.queueStatus || 'pending',
            t.isDuplicate ? 'Yes' : 'No',
            t.url || '',
            t.createdAt ? new Date(t.createdAt).toISOString() : '',
            t.downloadedAt ? new Date(t.downloadedAt).toISOString() : ''
        ]);

        const csv = [headers, ...rows].map(row =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = createElement('a', { href: url, download: `suno-queue-${Date.now()}.csv` });
        a.click();
        URL.revokeObjectURL(url);

        toastManager.success('Queue exported to CSV');
    };

    /**************************************************************
     *   LEGACY BUTTON FUNCTIONS (Deprecated - now in toolpanel)
     **************************************************************/
    // Old floating button functions have been removed.
    // Buttons are now created in buildToolPanelUI().

    /**************************************************************
     *   OBSERVER CONTAINER
     **************************************************************/
    const getClipsContainer = () => {
        // First try: find container via existing clip rows
        const clipRows = document.querySelectorAll('[data-testid="clip-row"]') || document.querySelector('.clip-row');
        if (clipRows.length > 0) {
            let container = clipRows[0]?.parentElement || document.querySelectorAll('[role="rowgroup"]');
            while (container && container !== document.body) {
                const allRows = container.querySelectorAll('[data-testid="clip-row"]');
                if (allRows.length >= clipRows.length) {
                    return container;
                }
                container = container.parentElement;
            }
        }

        // Second try: find via main-container structure
        const clipsContainer = document.querySelector('#main-container .w-split.w-split-horizontal, #main-container.w-split-pane');
        if (clipsContainer) {
            const lastChild = clipsContainer.lastElementChild;
            const firstChild = lastChild?.firstElementChild;
            if (firstChild?.children[1]) {
                return firstChild.children[1];
            }
        }

        // Third try: find scrollable panel
        const scrollable = document.querySelector('[data-panel="true"]');
        if (scrollable) return scrollable;

        // Fourth try: main content area
        const mainContent = document.querySelector('#main-container, main, [role="main"]');
        if (mainContent) return mainContent;

        // Final fallback: use body (automation can still work)
        return document.body;
    };

    /**************************************************************
     *   EXTRACT SONG ID FROM CLIP ROW
     **************************************************************/
    const extractSongIdFromClipRow = (clipRow) => {
        const link = clipRow.querySelector('a[href^="/song/"]');
        if (link) {
            const match = link.href.match(/\/song\/([a-f0-9-]+)/);
            if (match) return match[1];
        }

        if (clipRow.hasAttribute('data-key')) {
            return clipRow.getAttribute('data-key');
        }

        const img = clipRow.querySelector('img[data-src]');
        if (img && img.dataset.src) {
            const match = img.dataset.src.match(/image_(?:large_)?([a-f0-9-]+)/);
            if (match) return match[1];
        }

        return null;
    };

    /**************************************************************
     *   EXTRACT TRACK METADATA FROM CLIP ROW
     **************************************************************/
    const extractTrackMetadata = (clipRow) => {
        const songId = extractSongIdFromClipRow(clipRow);
        if (!songId) return null;

        let trackName = null;
        const link = clipRow.querySelector('a[href^="/song/"]');
        if (link) {
            trackName = (link.textContent || link.innerText || '').trim();
        }
        if (!trackName || trackName === 'Untitled') {
            const img = clipRow.querySelector('img[alt]');
            if (img && img.alt) {
                trackName = img.alt.replace(/\s+artwork$/i, '').trim();
                if (trackName === 'Untitled') trackName = null;
            }
        }
        if (!trackName) {
            trackName = songId;
        }

        let duration = null;
        const durationEl = clipRow.querySelector('.clip-image-container .css-421ta7');
        if (durationEl) {
            duration = durationEl.textContent.trim();
            if (duration === '--:--') duration = null;
        }

        let styles = null;
        const stylesEl = clipRow.querySelector('.css-ingj1g');
        if (stylesEl) {
            styles = (stylesEl.textContent || stylesEl.innerText || '').trim();
        }

        return {
            id: songId,
            name: trackName,
            duration: duration,
            styles: styles,
            timestamp: Date.now()
        };
    };

    /**************************************************************
     *   FILENAME HANDLING
     **************************************************************/
    const sanitizeFilename = (name) => {
        return name.replace(/[\/\\:*?"<>|]/g, '_').trim();
    };

    const getUniqueFilename = (baseName) => {
        const sanitized = sanitizeFilename(baseName);
        if (!filenameCounts[sanitized]) {
            filenameCounts[sanitized] = 1;
            return sanitized + '.mp3';
        } else {
            filenameCounts[sanitized]++;
            return sanitized + '_' + filenameCounts[sanitized] + '.mp3';
        }
    };

    /**************************************************************
     *   DOWNLOAD MP3 (WITH TRACK NAME)
     **************************************************************/
    const downloadMP3 = async (dataKey, retries = 3) => {
        // Prevent duplicate downloads
        if (downloadedKeys.includes(dataKey)) {
            log(`⏭️ Already downloaded: ${dataKey}`);
            return true;
        }
        if (currentlyDownloading.has(dataKey)) {
            log(`⏳ Already downloading: ${dataKey}`);
            return false;
        }

        // Mark as downloading to prevent duplicate calls
        currentlyDownloading.add(dataKey);

        try {
            const url = `https://cdn1.suno.ai/${dataKey}.mp3`;
            const metadata = trackMetadata.get(dataKey);
            const trackName = metadata?.name || dataKey;
            const filename = getUniqueFilename(trackName);

            log(`Downloading: ${trackName} (${dataKey})`);

            if (metadata) {
                metadata.downloadStatus = 'downloading';
                updateTrackTable();
            }

            let response;
            for (let i = 0; i < retries; i++) {
                response = await fetch(url);

                if (response.ok) {
                    break;
                }

                if (response.status === 404 && i < retries - 1) {
                    log(`⏳ File not ready, retrying in ${(i + 1) * 2}s... (${i + 1}/${retries - 1})`);
                    await sleep((i + 1) * 2000);
                    continue;
                }

                if (!response.ok) {
                    log(`ERROR: Fetch failed: ${response.status} ${response.statusText}`);
                    if (metadata) {
                        metadata.downloadStatus = 'failed';
                        updateTrackTable();
                    }
                    currentlyDownloading.delete(dataKey);
                    return false;
                }
            }

            if (!response || !response.ok) {
                log(`❌ Failed to download after ${retries} attempts`);
                if (metadata) {
                    metadata.downloadStatus = 'failed';
                    updateTrackTable();
                }
                currentlyDownloading.delete(dataKey);
                return false;
            }

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            totalDownloads++;

            // Get file size from blob
            const fileSize = blob.size;
            const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

            // Save to persistent storage with metadata to avoid re-downloading
            const trackMeta = metadata || trackMetadata.get(dataKey) || {};
            const downloadTimestamp = Date.now();

            saveDownloadedTrack(dataKey, {
                title: trackMeta.name || filename.replace('.mp3', ''),
                duration: trackMeta.duration,
                styles: trackMeta.styles,
                timestamp: downloadTimestamp,
                downloadedAt: downloadTimestamp,
                downloadFilename: filename,
                downloadPath: filename, // Browser downloads to default location, we store filename
                fileSize: fileSize,
                genStatus: trackMeta.genStatus || 'ready',
                downloadStatus: 'completed'
            });

            if (metadata) {
                metadata.downloadStatus = 'completed';
                metadata.downloadTimestamp = downloadTimestamp;
                metadata.downloadFilename = filename;
                metadata.fileSize = fileSize;
            }

            const index = dataKeyQueue.indexOf(dataKey);
            if (index > -1) dataKeyQueue.splice(index, 1);

            log(`SUCCESS: Downloaded: ${filename} (Total: ${totalDownloads})`);
            updateNotification(CLICK_LIMIT - totalClicks, dataKeyQueue.length);
            updateTrackTable();

            // Remove from currently downloading
            currentlyDownloading.delete(dataKey);

            return true;
        } catch (error) {
            log(`❌ Error downloading ${dataKey}:`, error.message);
            const metadata = trackMetadata.get(dataKey);
            if (metadata) {
                metadata.downloadStatus = 'failed';
                updateTrackTable();
            }
            // Remove from currently downloading on error too
            currentlyDownloading.delete(dataKey);
            return false;
        }
    };

    /**************************************************************
     *   CHECK AND DOWNLOAD
     **************************************************************/
    const checkAndDownload = () => {
        if (dataKeyQueue.length === 0) return;

        const queueCopy = [...dataKeyQueue];

        for (const dataKey of queueCopy) {
            if (downloadedKeys.includes(dataKey)) {
                const index = dataKeyQueue.indexOf(dataKey);
                if (index > -1) dataKeyQueue.splice(index, 1);
                continue;
            }

            const clipRow = Array.from(document.querySelectorAll('[data-testid="clip-row"]'))
                .find(row => {
                    const songId = extractSongIdFromClipRow(row);
                    return songId === dataKey;
                });

            if (!clipRow) {
                log(`WARNING: Clip row not found for: ${dataKey}`);
                continue;
            }

            const currentMetadata = extractTrackMetadata(clipRow);
            if (currentMetadata) {
                const existing = trackMetadata.get(dataKey);
                if (existing) {
                    existing.duration = currentMetadata.duration;
                    existing.name = currentMetadata.name || existing.name;
                    existing.styles = currentMetadata.styles || existing.styles;
                } else {
                    processCounter++;
                    currentMetadata.processNum = processCounter;
                    currentMetadata.genStatus = 'generating';
                    currentMetadata.downloadStatus = 'pending';
                    trackMetadata.set(dataKey, currentMetadata);
                }
            }

            const durationElement = clipRow.querySelector('.clip-image-container .css-421ta7');

            if (durationElement) {
                const duration = durationElement.textContent.trim();

                if (duration && duration !== '--:--' && duration.match(/^\d+:\d{2}$/)) {
                    const metadata = trackMetadata.get(dataKey);
                    if (metadata) {
                        metadata.genStatus = 'ready';
                        metadata.duration = duration;

                        // Save to history when track becomes ready (even if not downloaded yet)
                        const generationStarted = window.generationStartTime || metadata.generationStarted || Date.now();
                        const genSettings = window.currentGenerationSettings || null;
                        saveTrackToHistory({
                            id: dataKey,
                            title: metadata.name || 'Unknown',
                            url: `https://cdn1.suno.ai/${dataKey}.mp3`,
                            source: 'automation',
                            duration: duration,
                            styles: metadata.styles || null,
                            timestamp: Date.now(),
                            generationStarted: generationStarted,
                            initialText: genSettings?.initialText || metadata.initialText || null,
                            generationSettings: genSettings ? {
                                clicks: genSettings.clicks,
                                downloads: genSettings.downloads
                            } : metadata.generationSettings || null,
                            genStatus: 'ready',
                            downloadStatus: metadata.downloadStatus || 'pending'
                        });
                    }

                    log(`✓ Song ready: ${metadata?.name || dataKey} (${duration})`);
                    updateTrackTable();

                    downloadMP3(dataKey)
                        .catch((error) => log(`ERROR: Error downloading ${dataKey}:`, error.message));

                    if (DOWNLOAD_LIMIT > 0 && totalDownloads >= DOWNLOAD_LIMIT) {
                        log('🎯 Download limit reached');
                        return;
                    }
                } else {
                    log(`WAIT: Waiting for: ${dataKey} (duration: ${duration || 'processing...'})`);
                }
            } else {
                log(`⏳ Waiting for: ${dataKey} (duration element not found)`);
            }
        }
    };

    /**************************************************************
     *   OBSERVE NEW CLIP ROWS
     **************************************************************/
    const observeNewDivs = () => {
        // Get container - will fallback to document.body if needed
        let container = getClipsContainer();

        // Even if getClipsContainer returns something, ensure it's valid
        if (!container || !container.nodeType) {
            log('⚠️ Using document.body as observer target (no specific container found)');
            container = document.body;
        }

        // Track existing clips (if any) to avoid re-downloading them
        const existingRows = document.querySelectorAll('[data-testid="clip-row"]');
        existingRows.forEach(row => {
            const songId = extractSongIdFromClipRow(row);
            if (songId) {
                initialTrackIds.add(songId);
            }
        });

        if (initialTrackIds.size > 0) {
            log(`📊 Tracked ${initialTrackIds.size} pre-existing tracks (will not download)`);
        } else {
            log('📊 No existing tracks found - ready to track new generations');
        }

        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType !== 1) return;

                        let clipRow = null;
                        if (node.hasAttribute && node.getAttribute('data-testid') === 'clip-row') {
                            clipRow = node;
                        } else {
                            clipRow = node.querySelector?.('[data-testid="clip-row"]');
                        }

                        if (clipRow) {
                            const songId = extractSongIdFromClipRow(clipRow);

                            if (songId &&
                                !dataKeyQueue.includes(songId) &&
                                !downloadedKeys.includes(songId) &&
                                !initialTrackIds.has(songId)) {
                                const metadata = extractTrackMetadata(clipRow);
                                if (metadata) {
                                    processCounter++;
                                    metadata.processNum = processCounter;
                                    metadata.genStatus = 'generating';
                                    metadata.downloadStatus = 'pending';
                                    trackMetadata.set(songId, metadata);

                                    // Save to history when track is first detected (for tracking)
                                    const generationStarted = window.generationStartTime || Date.now();
                                    const genSettings = window.currentGenerationSettings || null;
                                    saveTrackToHistory({
                                        id: songId,
                                        title: metadata.name || 'Unknown',
                                        url: `https://cdn1.suno.ai/${songId}.mp3`,
                                        source: 'automation',
                                        duration: metadata.duration || null,
                                        styles: metadata.styles || null,
                                        timestamp: Date.now(),
                                        generationStarted: generationStarted,
                                        initialText: genSettings?.initialText || null,
                                        generationSettings: genSettings ? {
                                            clicks: genSettings.clicks,
                                            downloads: genSettings.downloads
                                        } : null,
                                        genStatus: 'generating',
                                        downloadStatus: 'pending'
                                    });

                                    log(`Queued NEW song: ${metadata.name || songId} (${songId})`);
                                    updateTrackTable();
                                }

                                dataKeyQueue.push(songId);
                                updateNotification(CLICK_LIMIT - totalClicks, dataKeyQueue.length);
                            } else if (songId && initialTrackIds.has(songId)) {
                                log(`⏭️ Skipped pre-existing track: ${songId}`);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(container, { childList: true, subtree: true });
        log('DOM observer started (only tracking NEW tracks)');
        return observer;
    };

    /**************************************************************
     *   TRACK TABLE UI
     **************************************************************/
    const exportTrackTableCSV = () => {
        // Export currently filtered/displayed tracks
        const tracks = getAllTracksForDisplay(trackTableFilter, trackTableSearch);
        if (tracks.length === 0) {
            toastManager.warning('No tracks to export');
            return;
        }
        const headers = ['#', 'Source', 'ID', 'Track Name', 'Duration', 'Downloaded At', 'Status', 'Styles/Prompt', 'URL'];
        const rows = tracks.map((track, index) => [
            index + 1,
            track.source || 'unknown',
            track.id || '',
            (track.title || track.name || '').replace(/"/g, '""'),
            track.duration || '',
            track.downloadedAt ? new Date(track.downloadedAt).toLocaleString() : (track.timestamp ? new Date(track.timestamp).toLocaleString() : ''),
            track.downloadStatus || 'completed',
            (track.styles || '').replace(/"/g, '""'),
            track.url || ''
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filterSuffix = trackTableFilter !== 'all' ? `_${trackTableFilter}` : '';
        a.download = `suno_tracks${filterSuffix}_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toastManager.success(`Exported ${tracks.length} tracks to CSV`);
    };

    // Track table modal instance
    let trackTableModal = null;
    let trackTableSorter = null;

    // Track table filter state
    let trackTableFilter = 'all';
    let trackTableSearch = '';

    /**************************************************************
     *   SIMPLIFIED TABLE BUILDER SYSTEM
     *   Two-phase approach: Headers define order, Columns define render
     **************************************************************/

    /**
     * Build a table from simplified schema (headers array controls order)
     * @param {Object} schema - { id, tbodyId, class, headers, columns }
     * @returns {HTMLTableElement}
     */
    const buildTableSimple = (schema) => {
        const table = createElement('table', {
            id: schema.id,
            class: schema.class || 'suno-table'
        });

        const thead = createElement('thead');
        const headerRow = createElement('tr');

        // Headers array controls order - iterate in array order
        schema.headers.forEach(h => {
            const thProps = { text: h.header };

            // Only add data-sort-key if sortKey is truthy
            if (h.sortKey) {
                thProps['data-sort-key'] = h.sortKey;
            }
            if (h.tooltip) {
                thProps['data-tooltip'] = h.tooltip;
            }

            const th = createElement('th', thProps);

            // Auto-generate class: key + '-head', or use custom cellClass + '-head'
            const baseClass = h.cellClass || h.key;
            th.classList.add(`${baseClass}-head`);

            // Apply optional column styling
            if (h.optional) {
                th.classList.add('optional-column');
                th.setAttribute('data-optional', 'true');
                th.style.display = 'none';
            }

            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);
        table.appendChild(createElement('tbody', { id: schema.tbodyId || `${schema.id}-body` }));

        // Setup cell expansion on click
        setupCellExpansion(table);

        return table;
    };

    /**
     * Add a row using simplified schema
     * @param {HTMLTableElement} table - The table element
     * @param {Object} schema - { headers, columns }
     * @param {Object} data - Row data
     * @param {number} rowIndex - Row index
     * @param {Object} options - { rowClass }
     * @returns {HTMLTableRowElement}
     */
    const addRowSimple = (table, schema, data, rowIndex, options = {}) => {
        const tbody = table.querySelector('tbody');
        if (!tbody) return null;

        const row = createElement('tr', { class: options.rowClass || '' });

        // Headers array controls column order
        schema.headers.forEach(h => {
            const cell = createElement('td');

            // Auto-generate class: key + '-cell', or use custom cellClass + '-cell'
            const baseClass = h.cellClass || h.key;
            cell.classList.add(`${baseClass}-cell`);

            // Apply optional styling from header - preserve current visibility state
            if (h.optional) {
                cell.classList.add('optional-column');
                // Check current visibility state from corresponding th element
                const th = table.querySelector(`th.${baseClass}-head`);
                // Only hide if th is hidden (preserves toggle state on refresh)
                if (!th || th.style.display === 'none') {
                    cell.style.display = 'none';
                }
            }

            // Look up render function from columns config
            const colConfig = schema.columns[h.key];
            if (colConfig && colConfig.render) {
                const result = colConfig.render(data, rowIndex, cell);
                if (result !== undefined && result !== null && typeof result !== 'object') {
                    cell.textContent = result;
                }
            }

            row.appendChild(cell);
        });

        tbody.appendChild(row);
        return row;
    };

    /**
     * Clear all rows from a table body
     * @param {HTMLTableElement} table
     */
    const clearTableBody = (table) => {
        const tbody = table.querySelector('tbody');
        if (tbody) tbody.textContent = '';
    };

    /**
     * Setup cell expansion on click for a table
     * Click a cell to expand it, click outside or another cell to collapse
     * @param {HTMLTableElement} table
     */
    const setupCellExpansion = (table) => {
        if (!table) return;

        // Add click handler to table (delegation)
        table.addEventListener('click', (e) => {
            const clickedCell = e.target.closest('td');

            if (clickedCell && table.contains(clickedCell)) {
                // Don't expand cells with buttons/links/inputs
                if (e.target.closest('button, a, input, .suno-btn')) {
                    return;
                }

                // Remove expanded class from all other cells in all tables
                document.querySelectorAll('.suno-table td.cell-expanded').forEach(cell => {
                    if (cell !== clickedCell) {
                        cell.classList.remove('cell-expanded');
                    }
                });

                // Toggle expansion on clicked cell
                clickedCell.classList.toggle('cell-expanded');
            }
        });
    };

    // Global click handler to collapse cells when clicking outside tables
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.suno-table td')) {
            document.querySelectorAll('.suno-table td.cell-expanded').forEach(cell => {
                cell.classList.remove('cell-expanded');
            });
        }
    });

    /**************************************************************
     *   TRACK TABLE - SIMPLIFIED DEFINITION
     *   PHASE 1: Headers array - ORDER OF LINES = COLUMN ORDER
     *   Just move lines to reorder columns!
     **************************************************************/

    const TRACK_TABLE_HEADERS = [
        { key: 'index', header: '#', sortKey: 'index' },
        { key: 'thumbnail', header: 'Img' },
        { key: 'name', header: 'Track Name', sortKey: 'title' },
        { key: 'duration', header: 'Duration', sortKey: 'duration' },
        { key: 'generated', header: 'Generated', sortKey: 'generationStarted', cellClass: 'gen-started' },
        { key: 'downloaded', header: 'Downloaded', sortKey: 'downloadedAt', cellClass: 'date' },
        { key: 'fileSize', header: 'Size', sortKey: 'fileSize' },
        { key: 'styles', header: 'Styles/Prompt', sortKey: 'styles', optional: true },
        { key: 'id', header: 'ID', sortKey: 'id', optional: true },
        { key: 'initialText', header: 'Initial Text', sortKey: 'initialText', optional: true },
        { key: 'settings', header: 'Settings', sortKey: 'generationSettings', optional: true },
        { key: 'status', header: 'Status', sortKey: 'downloadStatus' },
        { key: 'source', header: 'Source', sortKey: 'source' },
        { key: 'url', header: 'URL', cellClass: 'download-url-cell' },
    ];

    /**************************************************************
     *   PHASE 2: Column render functions (doesn't affect order)
     **************************************************************/

    const TRACK_TABLE_COLUMNS = {
        index: {
            render: (track, idx, cell) => {
                cell.textContent = (idx + 1).toString();
                cell.setAttribute('data-value', idx + 1);
            }
        },
        thumbnail: {
            render: (track, idx, cell) => {
                const thumbnailUrl = track.id ? `https://cdn2.suno.ai/image_${track.id}.jpeg` : null;
                const trackName = track.title || track.name || 'Unknown';
                if (thumbnailUrl) {
                    const anchor = createElement('a', {
                        href: thumbnailUrl,
                        class: 'suno-lightbox',
                        title: trackName
                    });
                    const img = createElement('img', {
                        src: thumbnailUrl,
                        alt: trackName,
                        style: 'width: 50px; height: 50px; object-fit: cover; border-radius: 4px; cursor: pointer; display: block;'
                    });
                    // Handle 403/404 errors with placeholder
                    img.onerror = () => handleImageError(img, thumbnailUrl);
                    anchor.appendChild(img);
                    cell.appendChild(anchor);
                } else {
                    cell.textContent = '-';
                }
            }
        },
        source: {
            render: (track, idx, cell) => {
                const source = track.source || (track.inSession ? 'session' : 'unknown');
                const badge = createElement('span', {
                    class: `source-badge ${source}`,
                    text: source.charAt(0).toUpperCase() + source.slice(1)
                });
                cell.appendChild(badge);
                cell.setAttribute('data-value', source);
            }
        },
        id: {
            render: (track, idx, cell) => {
                // Full ID in DOM, CSS handles truncation, click to expand
                cell.textContent = track.id || '-';
                cell.setAttribute('data-value', track.id || '');
                cell.setAttribute('title', track.id || ''); // Native tooltip on hover
            }
        },
        name: {
            render: (track, idx, cell) => {
                const trackName = track.title || track.name || 'Unknown';
                const displayName = trackName.length > 25 ? trackName.substring(0, 25) + '...' : trackName;
                cell.textContent = displayName;
                cell.setAttribute('data-value', trackName);
                cell.setAttribute('data-tooltip', trackName);
            }
        },
        duration: {
            render: (track, idx, cell) => {
                const duration = track.duration || '--:--';
                cell.textContent = duration;
                cell.setAttribute('data-value', duration);
            }
        },
        generated: {
            render: (track, idx, cell) => {
                const timestamp = track.generationStarted || track.timestamp || null;
                const dateStr = timestamp ? new Date(timestamp).toLocaleString() : '-';
                cell.textContent = dateStr;
                cell.setAttribute('data-value', timestamp || 0);
            }
        },
        downloaded: {
            render: (track, idx, cell) => {
                const downloadedAt = track.downloadedAt || null;
                const dateStr = downloadedAt ? new Date(downloadedAt).toLocaleString() : '-';
                const downloadInfo = downloadedAt && track.downloadFilename
                    ? `${dateStr}\n${track.downloadFilename}${track.downloadPath ? '\n' + track.downloadPath : ''}`
                    : dateStr;
                cell.textContent = downloadInfo.split('\n')[0];
                cell.setAttribute('data-value', downloadedAt || 0);
                cell.setAttribute('data-tooltip', downloadInfo);
            }
        },
        fileSize: {
            render: (track, idx, cell) => {
                const fileSize = track.fileSize || null;
                const sizeStr = fileSize ? (fileSize / (1024 * 1024)).toFixed(2) + ' MB' : '-';
                cell.textContent = sizeStr;
                cell.setAttribute('data-value', fileSize || 0);
            }
        },
        url: {
            render: (track, idx, cell) => {
                if (track.url && track.url.includes('http')) {
                    const btn = createElement('button', {
                        class: 'suno-btn suno-btn-icon suno-btn-grad',
                        'data-tooltip': 'Open download URL in new tab'
                    });
                    btn.appendChild(createIcon('download', '14px'));
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(track.url, '_blank');
                    });
                    cell.appendChild(btn);
                } else {
                    cell.textContent = '-';
                }
            }
        },
        status: {
            render: (track, idx, cell) => {
                const status = track.downloadStatus || 'completed';
                const badge = createElement('span', {
                    class: `status-badge ${status}`,
                    text: status
                });
                cell.appendChild(badge);
                cell.setAttribute('data-value', status);
            }
        },
        styles: {
            render: (track, idx, cell) => {
                const styles = track.styles || '';
                const displayText = styles ? (styles.length > 40 ? styles.substring(0, 40) + '...' : styles) : '-';
                cell.textContent = displayText;
                cell.setAttribute('data-value', styles);
                cell.setAttribute('data-tooltip', styles);
            }
        },
        initialText: {
            render: (track, idx, cell) => {
                const text = track.initialText || '';
                const displayText = text ? (text.length > 30 ? text.substring(0, 30) + '...' : text) : '-';
                cell.textContent = displayText;
                cell.setAttribute('data-value', text);
                cell.setAttribute('data-tooltip', text);
            }
        },
        settings: {
            render: (track, idx, cell) => {
                const settings = track.generationSettings;
                const text = settings
                    ? `Clicks: ${settings.clicks || 'N/A'}, Downloads: ${settings.downloads || 'N/A'}`
                    : '-';
                cell.textContent = text;
                cell.setAttribute('data-value', settings ? JSON.stringify(settings) : '');
                cell.setAttribute('data-tooltip', text);
            }
        }
    };

    /**************************************************************
     *   TRACK TABLE SCHEMA - Combines headers + columns
     **************************************************************/

    const TRACK_TABLE = {
        id: 'suno-track-table',
        tbodyId: 'suno-track-table-body',
        class: 'suno-table',
        headers: TRACK_TABLE_HEADERS,
        columns: TRACK_TABLE_COLUMNS
    };

    // Helper to get row class based on track data
    const getTrackRowClass = (track) => {
        let rowClass = '';
        if (track.inSession) rowClass += ' in-session';
        if (track.inHistory) rowClass += ' in-history';
        return rowClass.trim();
    };

    /**************************************************************
     *   FETCH QUEUE TABLE - Schema Definition
     **************************************************************/

    const QUEUE_TABLE_HEADERS = [
        { key: 'select', header: '', cellClass: 'select' },  // Checkbox column
        { key: 'index', header: '#', sortKey: 'index' },
        { key: 'thumbnail', header: 'Img' },
        { key: 'name', header: 'Track Name', sortKey: 'title' },
        { key: 'duration', header: 'Duration', sortKey: 'duration' },
        { key: 'created', header: 'Created', sortKey: 'createdAt' },
        { key: 'style', header: 'Style', sortKey: 'tags', optional: true },
        { key: 'prompt', header: 'Prompt', sortKey: 'prompt', optional: true },
        { key: 'version', header: 'Ver.', sortKey: 'modelVersion', optional: true },
        { key: 'workspace', header: 'Workspace', sortKey: 'workspaceName', optional: true },
        { key: 'dedupe', header: 'Dedupe', sortKey: 'isDuplicate' },
        { key: 'status', header: 'Status', sortKey: 'queueStatus' },
        { key: 'actions', header: 'Actions' }
    ];

    const QUEUE_TABLE_COLUMNS = {
        select: {
            render: (track, idx, cell) => {
                const checkbox = createElement('input', {
                    type: 'checkbox',
                    class: 'queue-select-checkbox',
                    'data-track-id': track.id,
                    'data-row-index': idx.toString()
                });
                checkbox.checked = isQueueTrackSelected(track.id);

                // Handle click with keyboard modifiers
                checkbox.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleQueueRowSelection(track.id, idx, e);
                });

                // Prevent change event from double-firing
                checkbox.addEventListener('change', (e) => {
                    e.stopPropagation();
                });

                cell.appendChild(checkbox);

                // Make entire row clickable for selection
                cell.closest('tr')?.addEventListener('click', (e) => {
                    // Don't trigger if clicking on buttons or links
                    if (e.target.closest('button, a, input')) return;
                    handleQueueRowSelection(track.id, idx, e);
                });
            }
        },
        index: {
            render: (track, idx, cell) => {
                cell.textContent = (idx + 1).toString();
                cell.setAttribute('data-value', idx + 1);
            }
        },
        thumbnail: {
            render: (track, idx, cell) => {
                const thumbnailUrl = track.thumbnailUrl || (track.id ? `https://cdn2.suno.ai/image_${track.id}.jpeg` : null);
                if (thumbnailUrl) {
                    const img = createElement('img', {
                        src: thumbnailUrl,
                        alt: track.title || track.rawTitle || 'Track',
                        style: 'width: 40px; height: 40px; object-fit: cover; border-radius: 4px;'
                    });
                    // Handle 403/404 errors with placeholder
                    img.onerror = () => handleImageError(img, thumbnailUrl);
                    cell.appendChild(img);
                } else {
                    cell.textContent = '-';
                }
            }
        },
        name: {
            render: (track, idx, cell) => {
                const titleSpan = createElement('span', {
                    text: track.rawTitle || track.title || 'Unknown',
                    title: track.rawTitle || track.title
                });
                cell.appendChild(titleSpan);
            }
        },
        duration: {
            render: (track, idx, cell) => {
                cell.textContent = track.duration || '--:--';
                cell.setAttribute('data-value', track.durationSeconds || 0);
            }
        },
        created: {
            render: (track, idx, cell) => {
                if (track.createdAt) {
                    const date = new Date(track.createdAt);
                    cell.textContent = date.toLocaleDateString();
                    cell.setAttribute('title', date.toLocaleString());
                } else {
                    cell.textContent = '-';
                }
            }
        },
        style: {
            render: (track, idx, cell) => {
                cell.textContent = track.tags || '-';
                cell.setAttribute('title', track.tags || '');
            }
        },
        prompt: {
            render: (track, idx, cell) => {
                cell.textContent = track.prompt || '-';
                cell.setAttribute('title', track.prompt || '');
            }
        },
        version: {
            render: (track, idx, cell) => {
                cell.textContent = track.modelVersion || '-';
            }
        },
        workspace: {
            render: (track, idx, cell) => {
                cell.textContent = track.workspaceName || '-';
            }
        },
        dedupe: {
            render: (track, idx, cell) => {
                if (track.isDuplicate) {
                    // Determine why it's a duplicate
                    let reason = 'Duplicate detected';
                    if (track.duplicateReason) {
                        reason = track.duplicateReason;
                    } else if (isTrackInDownloadedMatches(track.id)) {
                        reason = 'Already downloaded (ID match)';
                    } else if (track.duplicateMatch) {
                        reason = `Duplicate of: ${track.duplicateMatch}`;
                    }

                    const badge = createElement('span', {
                        class: 'suno-badge badge-warning',
                        text: 'Dupe',
                        title: reason,
                        'data-tooltip': reason
                    });
                    cell.appendChild(badge);
                } else {
                    const badge = createElement('span', {
                        class: 'suno-badge badge-success',
                        text: 'New',
                        title: 'Unique track',
                        'data-tooltip': 'Unique track'
                    });
                    cell.appendChild(badge);
                }
            }
        },
        status: {
            render: (track, idx, cell) => {
                const status = track.queueStatus || 'pending';
                const statusClass = {
                    'pending': '',
                    'downloading': 'badge-info',
                    'completed': 'badge-success',
                    'failed': 'badge-danger',
                    'skipped': 'badge-warning'
                }[status] || '';

                // Build tooltip with explanation
                let tooltip = `Status: ${status}`;
                if (status === 'failed' && track.error) {
                    tooltip += ` - Error: ${track.error}`;
                } else if (status === 'skipped' && track.reason) {
                    tooltip += ` - ${track.reason}`;
                } else if (status === 'duplicate' && track.duplicateReason) {
                    tooltip += ` - ${track.duplicateReason}`;
                } else if (status === 'completed' && track.downloadedAt) {
                    const date = new Date(track.downloadedAt).toLocaleString();
                    tooltip += ` - Downloaded: ${date}`;
                }

                const badge = createElement('span', {
                    class: `suno-badge ${statusClass}`,
                    text: status,
                    title: tooltip,
                    'data-tooltip': tooltip
                });
                cell.appendChild(badge);
            }
        },
        actions: {
            render: (track, idx, cell) => {
                // Download button
                const downloadBtn = createElement('button', {
                    class: 'suno-btn suno-btn-icon btn-sm',
                    title: 'Download this track'
                });
                downloadBtn.appendChild(createIcon('download', '12px'));
                downloadBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    downloadSingleQueueTrack(track);
                });

                // Remove button
                const removeBtn = createElement('button', {
                    class: 'suno-btn suno-btn-icon btn-sm btn-danger',
                    title: 'Remove from queue'
                });
                removeBtn.appendChild(createIcon('trash', '12px'));
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeFromFetchQueue([track.id]);
                    updateQueueTable();
                });

                cell.appendChild(downloadBtn);
                cell.appendChild(removeBtn);
            }
        }
    };

    const QUEUE_TABLE = {
        id: 'suno-queue-table',
        tbodyId: 'suno-queue-table-body',
        class: 'suno-table',
        headers: QUEUE_TABLE_HEADERS,
        columns: QUEUE_TABLE_COLUMNS
    };

    // Helper to get queue row class
    const getQueueRowClass = (track) => {
        let rowClass = '';
        if (track.isDuplicate) rowClass += ' is-duplicate';
        if (isQueueTrackSelected(track.id)) rowClass += ' is-selected';
        if (track.queueStatus === 'completed') rowClass += ' is-completed';
        if (track.queueStatus === 'failed') rowClass += ' is-failed';
        return rowClass.trim();
    };

    // Update queue selection UI (checkboxes and stats)
    const updateQueueSelectionUI = () => {
        // Update checkbox states
        document.querySelectorAll('.queue-select-checkbox').forEach(cb => {
            const trackId = cb.getAttribute('data-track-id');
            cb.checked = isQueueTrackSelected(trackId);
        });

        // Update select all checkbox
        const selectAllCb = document.getElementById('queue-select-all');
        if (selectAllCb) {
            const stats = getQueueStats();
            selectAllCb.checked = stats.selected === stats.total && stats.total > 0;
            selectAllCb.indeterminate = stats.selected > 0 && stats.selected < stats.total;
        }

        // Update stats display
        updateQueueStatsDisplay();
    };

    // Update queue stats display
    const updateQueueStatsDisplay = () => {
        const stats = getQueueStats();
        const statsContainer = document.querySelector('.suno-queue-stats');
        if (statsContainer) {
            const items = statsContainer.querySelectorAll('.suno-stat-item');
            items.forEach(item => {
                const key = item.getAttribute('data-stat');
                if (key && stats[key] !== undefined) {
                    const valueEl = item.querySelector('.suno-stat-value');
                    if (valueEl) valueEl.textContent = stats[key].toString();
                }
            });
        }

        // Update queue tab count (no brackets - CSS handles formatting)
        const queueTabBtn = document.querySelector('.suno-tab-btn[data-filter="queue"] .suno-stat-value');
        if (queueTabBtn) {
            queueTabBtn.textContent = stats.total.toString();
        }
    };

    // Track current render operation to cancel on new updates
    let queueRenderAbortController = null;

    // Update queue table display with chunked rendering for performance
    const updateQueueTable = async () => {
        const table = document.getElementById('suno-queue-table');
        const emptyMsg = document.getElementById('suno-queue-empty');
        if (!table) return;

        // Cancel any in-progress render
        if (queueRenderAbortController) {
            queueRenderAbortController.abort();
        }
        queueRenderAbortController = new AbortController();
        const signal = queueRenderAbortController.signal;

        const filtered = getFilteredQueue('all', trackTableSearch);

        // Clear table body
        clearTableBody(table);

        // Show/hide empty state using class toggle (keeps DOM alive)
        if (emptyMsg) {
            if (filtered.length === 0) {
                emptyMsg.classList.remove('tab-hidden');
            } else {
                emptyMsg.classList.add('tab-hidden');
            }
        }

        // Update stats immediately
        updateQueueStatsDisplay();
        updateQueueSelectionUI();

        // Chunked rendering for large queues (prevents UI freeze)
        const CHUNK_SIZE = 50;

        if (filtered.length <= CHUNK_SIZE) {
            // Small queue - render synchronously
            filtered.forEach((track, index) => {
                addRowSimple(table, QUEUE_TABLE, track, index, {
                    rowClass: getQueueRowClass(track)
                });
            });
        } else {
            // Large queue - render in chunks with animation frame yields
            for (let i = 0; i < filtered.length; i += CHUNK_SIZE) {
                // Check if render was aborted (new update started)
                if (signal.aborted) return;

                const chunk = filtered.slice(i, i + CHUNK_SIZE);
                chunk.forEach((track, chunkIdx) => {
                    addRowSimple(table, QUEUE_TABLE, track, i + chunkIdx, {
                        rowClass: getQueueRowClass(track)
                    });
                });

                // Yield to browser to prevent freeze
                if (i + CHUNK_SIZE < filtered.length) {
                    await new Promise(resolve => requestAnimationFrame(resolve));
                }
            }
        }
    };

    // Start queue fetch - triggers the existing bulk fetch process
    const startQueueFetch = async () => {
        if (queueModalState.isFetching || queueMeta.isFetching || fetchState.fetching) {
            toastManager.info('Fetch already running. Use pause/stop to control it.');
            updateQueueProcessControls();
            return;
        }

        // Get all possible fetch buttons (old modal and new queue modal)
        const fetchBtns = document.querySelectorAll('#queue-fetch-btn, #queue-modal-fetch-btn');

        const beginProcess = () => {
            queueModalState.isFetching = true;
            queueModalState.fetchPaused = false;
            queueModalState.activeProcess = 'fetch';
            queueMeta.isFetching = true;
            queueMeta.fetchPaused = false;
            queueMeta.activeProcess = 'fetch';
            fetchState.stopped = false;
            fetchState.paused = false;
            saveFetchQueue();
            fetchBtns.forEach(btn => lockProcessButton(btn, true));
            updateQueueProcessControls();
            addQueueModalLogEntry('Fetching tracks from current page...', 'info');

            showQueueProgress('Fetching tracks from page...');
            updateProgressCard({
                downloads: 0,
                downloadLimit: 0,
                pending: fetchQueue.length,
                tracks: fetchState.allSongs?.size || 0,
                isPaused: false,
                isStopped: false,
                source: getCurrentFetchSource()
            }, 'bulk');
            setPerfMode(true);
        };

        const finishProcess = () => {
            queueModalState.isFetching = false;
            queueModalState.fetchPaused = false;
            queueModalState.activeProcess = null;
            queueMeta.isFetching = false;
            queueMeta.fetchPaused = false;
            queueMeta.activeProcess = null;
            saveFetchQueue();
            fetchBtns.forEach(btn => lockProcessButton(btn, false));
            updateQueueProcessControls();
            updateProgressCard({
                downloads: 0,
                downloadLimit: 0,
                pending: fetchQueue.length,
                tracks: fetchState.allSongs?.size || fetchQueue.length || 0,
                isPaused: false,
                isStopped: true,
                source: getCurrentFetchSource()
            }, 'bulk');
            hideQueueProgress();
            setPerfMode(false);
        };

        beginProcess();

        try {
            const progressTextEl = document.getElementById('queue-modal-progress-text');
            // Get songs from page using enhanced extraction
            const songs = getSongsFromPage(fetchState.titleCounts || {}, fetchState.seenUrls || new Set());

            if (songs.length === 0) {
                toastManager.warning('No tracks found on current page. Try using Fetch All from the panel.');
                if (progressTextEl) progressTextEl.textContent = 'No tracks found';
                addQueueModalLogEntry('No tracks found on current page.', 'warning');
                return;
            }

            // Add to fetchState and queue
            for (const s of songs) {
                fetchState.allSongs.set(`${s.title}|${s.url}`, s);
            }
            syncFetchStateToQueue();

            if (progressTextEl) progressTextEl.textContent = `Added ${songs.length} tracks`;
            toastManager.success(`Added ${songs.length} tracks to queue`);
            addQueueModalLogEntry(`Added ${songs.length} tracks from current page`, 'success');

            // Update both modal tables
            updateQueueTable();
            updateQueueModalTable();
            updateQueueModalStats();
        } finally {
            finishProcess();
        }
    };

    // Download selected queue tracks
    const downloadSelectedQueueTracks = async () => {
        const selectedIds = Array.from(queueSelection);
        if (selectedIds.length === 0) {
            toastManager.warning('No tracks selected');
            return;
        }

        const selectedTracks = fetchQueue.filter(t => selectedIds.includes(t.id) && (t.queueStatus === 'pending' || !t.queueStatus));

        if (selectedTracks.length === 0) {
            toastManager.warning('No pending tracks in selection');
            return;
        }

        const confirmed = await toastManager.confirm(
            `Download ${selectedTracks.length} selected track(s)?`
        );

        if (!confirmed) return;

        // Use the proper download process function
        await startQueueDownloadProcess(selectedTracks);
    };

    // Show download confirmation before starting
    const showDownloadConfirmation = async () => {
        const stats = getQueueStats();
        const pendingTracks = fetchQueue.filter(t => t.queueStatus === 'pending' && !t.isDuplicate);

        if (pendingTracks.length === 0) {
            toastManager.warning('No pending tracks to download');
            return;
        }

        let message = `Download ${pendingTracks.length} track(s)?`;
        if (stats.duplicates > 0) {
            message += `\n(${stats.duplicates} duplicate(s) will be skipped)`;
        }

        const confirmed = await toastManager.confirm(message);
        if (!confirmed) return;

        await downloadQueueTracks(pendingTracks);
    };

    /**
     * Sync fetchState.allSongs to fetchQueue (bridges old bulk downloader to new queue)
     * Called during fetch to keep queue table updated in real-time
     */
    const syncFetchStateToQueue = () => {
        // Sync from bulkDownloaderState.fetch.allSongs to fetchQueue
        if (!bulkDownloaderState.fetch.allSongs || bulkDownloaderState.fetch.allSongs.size === 0) return;

        const songs = Array.from(bulkDownloaderState.fetch.allSongs.values());
        const existingIds = new Set(fetchQueue.map(t => t.id));
        let added = 0;

        for (const song of songs) {
            if (!song.id || existingIds.has(song.id)) continue;

            // Check deduplication status (downloaded + imported)
            applyQueueDuplicateFlag(song);

            fetchQueue.push({
                ...song,
                isDuplicate: song.isDuplicate,
                queueStatus: 'pending',
                addedAt: Date.now(),
                fetchedAt: song.fetchedAt || Date.now()
            });
            existingIds.add(song.id);
            added++;
        }

        if (added > 0) {
            queueMeta.lastFetchAt = Date.now();
            queueMeta.totalFetched = fetchQueue.length;
            queueMeta.fetchSource = window.location.href;
            saveFetchQueue();
        }

        // Update Queue Modal if visible
        const queueOverlay = document.querySelector('.suno-modal-overlay[data-modal="queue"]');
        if (queueOverlay && queueOverlay.classList.contains('visible')) {
            updateQueueModalTable();
            updateQueueModalStats();
        }

        // Update queue table if visible (old modal)
        if (trackTableFilter === 'queue') {
            updateQueueTable();
        }

        // Update queue tab count
        updateQueueStatsDisplay();

        return added;
    };

    /**
     * Show/hide fetch status indicator in modal header
     * @param {boolean} isActive - Whether fetch is currently running
     * @param {string} message - Optional status message
     */
    const updateFetchIndicator = (isActive, message = 'Fetching...') => {
        let indicator = document.getElementById('suno-fetch-indicator');

        // Create indicator if it doesn't exist
        if (!indicator) {
            const modalTitle = document.querySelector('.suno-modal-overlay[data-modal="track-status"] .suno-modal-header h2, .suno-modal-overlay[data-modal="track-status"] .suno-modal-title');
            if (!modalTitle) return;

            indicator = createElement('span', {
                id: 'suno-fetch-indicator',
                class: 'suno-fetch-indicator hidden'
            });
            indicator.appendChild(createElement('span', { class: 'pulse-dot' }));
            indicator.appendChild(createElement('span', { class: 'fetch-status-text', text: message }));
            modalTitle.appendChild(indicator);
        }

        // Update visibility and message
        if (isActive) {
            indicator.classList.remove('hidden');
            indicator.classList.add('active');
            const textEl = indicator.querySelector('.fetch-status-text');
            if (textEl) textEl.textContent = message;
        } else {
            indicator.classList.add('hidden');
            indicator.classList.remove('active');
        }
    };

    /**
     * Open the queue tab in the track modal (for integration with bulk downloader)
     */
    const openQueueTab = () => {
        // First, ensure the track modal is open
        if (!document.querySelector('.suno-modal-overlay[data-modal="track-status"]')) {
            showTrackTableModal();
        }

        // Switch to queue tab
        setTimeout(() => {
            const queueTabBtn = document.querySelector('.suno-tab-btn[data-filter="queue"]');
            if (queueTabBtn) {
                queueTabBtn.click();
            }
        }, 100);
    };

    // Download tracks from queue
    const downloadQueueTracks = async (tracks) => {
        if (tracks.length === 0) return;

        queueMeta.isDownloading = true;
        let downloaded = 0;
        let failed = 0;
        let skipped = 0;
        const total = tracks.length;

        // Create/update progress indicator
        let progressContainer = document.getElementById('suno-queue-download-progress');
        if (!progressContainer) {
            progressContainer = createElement('div', {
                id: 'suno-queue-download-progress',
                class: 'suno-download-progress'
            });
            const queueActionsBar = document.getElementById('suno-queue-actions-bar');
            if (queueActionsBar) {
                queueActionsBar.insertAdjacentElement('afterend', progressContainer);
            }
        }

        // Disable action buttons during download
        const downloadBtns = document.querySelectorAll('#queue-download-selected-btn, #queue-download-all-btn');
        downloadBtns.forEach(btn => btn.disabled = true);

        const updateProgress = (current, status, trackTitle) => {
            const percent = Math.round((current / total) * 100);
            progressContainer.innerHTML = '';

            const progressBar = createElement('div', { class: 'suno-progress-bar' });
            const progressFill = createElement('div', {
                class: 'suno-progress-fill',
                style: { width: `${percent}%` }
            });
            progressBar.appendChild(progressFill);

            const progressText = createElement('div', { class: 'suno-progress-text' });
            progressText.appendChild(createIcon(status === 'downloading' ? 'download' : 'checkmark', '14px'));
            progressText.appendChild(createElement('span', {
                text: ` ${current}/${total} - ${trackTitle}`
            }));

            const statsText = createElement('div', { class: 'suno-progress-stats' });
            statsText.textContent = `✓ ${downloaded} | ✗ ${failed} | ⏭ ${skipped}`;

            progressContainer.appendChild(progressBar);
            progressContainer.appendChild(progressText);
            progressContainer.appendChild(statsText);
        };

        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];

            updateProgress(i + 1, 'downloading', track.rawTitle || track.title);

            if (!track.url) {
                failed++;
                updateQueueTrackStatus(track.id, 'failed', { error: 'No URL' });
                continue;
            }

            // Skip if already downloaded (in no-duple list)
            if (isTrackInDownloadedMatches(track.id)) {
                skipped++;
                updateQueueTrackStatus(track.id, 'skipped', { reason: 'Already downloaded' });
                continue;
            }

            updateQueueTrackStatus(track.id, 'downloading');
            updateQueueTable();

            try {
                if (typeof GM_download !== 'undefined') {
                    GM_download({
                        url: track.url,
                        name: track.filename || track.title + '.mp3',
                        saveAs: false
                    });
                } else {
                    window.open(track.url, '_blank');
                }

                downloaded++;
                updateQueueTrackStatus(track.id, 'completed', { downloadedAt: Date.now() });
                addToDownloadLog(track);

                // Mark as downloaded to prevent re-downloads
                addToDownloadedMatches({
                    id: track.id,
                    filename: track.filename || track.title + '.mp3',
                    duration: track.duration,
                    downloadedAt: Date.now()
                });

                // Wait between downloads
                await sleep(800);
            } catch (e) {
                failed++;
                updateQueueTrackStatus(track.id, 'failed', { error: e.message });
            }

            updateQueueTable();
        }

        queueMeta.isDownloading = false;
        queueMeta.totalDownloaded += downloaded;
        saveFetchQueue();

        // Re-enable buttons
        downloadBtns.forEach(btn => btn.disabled = false);

        // Update progress to show completion
        updateProgress(total, 'completed', 'Complete!');

        // Remove progress after delay
        setTimeout(() => {
            if (progressContainer) {
                progressContainer.remove();
            }
        }, 5000);

        toastManager.success(`Download complete! ${downloaded} succeeded, ${failed} failed, ${skipped} skipped`);
    };

    /* ============================================================
    *   BUNDLED SCHEMA METHOD (BACKUP/REFERENCE)
    *   Alternative approach with all config in one object
    * ============================================================
    *
    * const buildTableFromSchema = (schema) => { ... };
    * const addTableRow = (table, columns, data, rowIndex, options) => { ... };
    *
    * const TRACK_TABLE_SCHEMA = {
    *     id: 'suno-track-table',
    *     columns: [
    *         { key: 'index', header: '#', sortKey: 'index', cellClass: 'index-cell',
    *           render: (track, idx, cell) => { ... } },
    *         // ... all columns with render inline
    *     ]
    * };
    *
    * Usage: buildTableFromSchema(TRACK_TABLE_SCHEMA);
    *        addTableRow(table, TRACK_TABLE_SCHEMA.columns, data, idx, opts);
    * ============================================================
    */

    const showTrackTableModal = () => {
        // If modal already exists, just show it and update content
        if (trackTableModal && document.querySelector('.suno-modal-overlay[data-modal="track-status"]')) {
            const overlay = document.querySelector('.suno-modal-overlay[data-modal="track-status"]');
            overlay.classList.add('visible');
            updateTrackTable();

            // Re-initialize sorter for existing table
            const table = document.querySelector('#suno-track-table');
            if (table) {
                trackTableSorter = new TableSorter(table, { key: 'downloadedAt', reverse: true });
            }
            return;
        }

        // Create new modal
        trackTableModal = new SunoModalBuilder('Track Generation & Download History', {
            titleIcon: 'musical-notes',
            maxWidth: '95vw',
            draggable: false,
            showClose: true
        });

        // Create content wrapper
        const wrapper = createElement('div', { class: 'suno-track-modal-content' });

        // Create stats summary row (hidden - data shown in tabs)
        const statsRow = createElement('div', { class: 'suno-track-stats hide', id: 'suno-track-stats' });
        wrapper.appendChild(statsRow);

        // Create filter/search bar
        const filterBar = createElement('div', { class: 'suno-track-filter-bar' });

        // Tab buttons with integrated stats
        const tabsContainer = createElement('div', { class: 'suno-track-tabs' });
        const tabs = [
            { id: 'all', label: 'Total Tracks', icon: 'music' },
            { id: 'automation', label: 'Automation', icon: 'bolt' },
            { id: 'bulk', label: 'Bulk Downl.', icon: 'cloudDownload' },
            { id: 'session', label: 'This Session', icon: 'play' },
            { id: 'queue', label: 'Fetch Queue', icon: 'cloud-download-outline' }
        ];

        const tabTooltips = {
            'all': 'View all tracks in history',
            'automation': 'View tracks from automation runs',
            'bulk': 'View tracks from bulk downloads',
            'session': 'View tracks from current session only',
            'queue': 'View and manage fetched tracks for download'
        };

        tabs.forEach(tab => {
            const btn = createElement('button', {
                class: `suno-tab-btn ${tab.id === trackTableFilter ? 'active' : ''}`,
                'data-filter': tab.id,
                'data-tooltip': tabTooltips[tab.id] || `Filter by ${tab.label}`
            });
            btn.appendChild(createIcon(tab.icon));
            btn.appendChild(createElement('span', { text: tab.label }));
            btn.appendChild(createElement('span', { class: 'suno-stat-value', text: '0' }));
            btn.addEventListener('click', () => {
                if (btn.disabled) return;

                // Queue tab opens the Queue Manager modal instead
                if (tab.id === 'queue') {
                    trackTableModal.close();
                    showQueueModal();
                    return;
                }

                trackTableFilter = tab.id;
                tabsContainer.querySelectorAll('.suno-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateTrackTable();
            });
            tabsContainer.appendChild(btn);
        });
        filterBar.appendChild(tabsContainer);

        // Search input
        const searchContainer = createElement('div', { class: 'suno-track-search' });
        const searchInput = createElement('input', {
            type: 'text',
            placeholder: 'Search tracks...',
            id: 'suno-track-search-input',
            class: 'suno-input',
            'data-tooltip': 'Search by track name, ID, or styles'
        });
        searchInput.addEventListener('input', (e) => {
            trackTableSearch = e.target.value;
            updateTrackTable();
        });
        searchContainer.appendChild(createIcon('search'));
        searchContainer.appendChild(searchInput);
        filterBar.appendChild(searchContainer);

        wrapper.appendChild(filterBar);

        // Create table using schema builder
        const scroll = createElement('div', {
            id: 'suno-track-table-scroll',
            class: 'suno-table-scroll'
        });

        // Build table using simplified schema - headers array controls column order
        const table = buildTableSimple(TRACK_TABLE);

        // Add toggle button for optional columns
        const toggleOptionalBtn = createElement('button', {
            id: 'suno-toggle-optional',
            class: 'suno-btn suno-btn-icon',
            'data-tooltip': 'Show/Hide optional columns (ID, Styles, Initial Text, Settings)'
        });
        toggleOptionalBtn.appendChild(createIcon('eye-off', '16px'));
        toggleOptionalBtn.addEventListener('click', () => {
            // Select all optional columns (both th and td with optional-column class)
            const optionalCols = table.querySelectorAll('.optional-column');
            const isVisible = optionalCols[0]?.style.display !== 'none';
            optionalCols.forEach(col => {
                col.style.display = isVisible ? 'none' : '';
            });
            updateIcon(toggleOptionalBtn, isVisible ? 'eye-off' : 'eye');
        });
        filterBar.appendChild(toggleOptionalBtn);

        scroll.appendChild(table);
        wrapper.appendChild(scroll);

        // ============================================
        // QUEUE TABLE SECTION (hidden by default)
        // ============================================

        // Queue actions bar (hidden by default, shown when queue tab is active)
        const queueActionsBar = createElement('div', {
            id: 'suno-queue-actions-bar',
            class: 'suno-queue-actions-bar tab-hidden'
        });

        // Select all checkbox
        const selectAllContainer = createElement('div', { class: 'suno-select-all-container' });
        const selectAllCheckbox = createElement('input', {
            type: 'checkbox',
            id: 'queue-select-all',
            class: 'queue-select-all'
        });
        selectAllCheckbox.addEventListener('change', (e) => {
            const visibleTracks = getFilteredQueue(trackTableFilter === 'queue' ? 'all' : trackTableFilter, trackTableSearch);
            const visibleIds = visibleTracks.map(t => t.id);
            if (e.target.checked) {
                selectAllQueueTracks(visibleIds);
            } else {
                deselectAllQueueTracks();
            }
            updateQueueSelectionUI();
            updateQueueTable();
        });
        selectAllContainer.appendChild(selectAllCheckbox);
        selectAllContainer.appendChild(createElement('label', {
            for: 'queue-select-all',
            text: 'Select All'
        }));
        queueActionsBar.appendChild(selectAllContainer);

        // Queue stats
        const queueStatsContainer = createElement('div', { class: 'suno-queue-stats' });
        const statItems = [
            { key: 'total', label: 'Total', icon: 'list' },
            { key: 'selected', label: 'Selected', icon: 'checkbox' },
            { key: 'duplicates', label: 'Dupes', icon: 'duplicate' },
            { key: 'pending', label: 'Pending', icon: 'time' }
        ];
        statItems.forEach(item => {
            const stat = createElement('div', { class: 'suno-stat-item', 'data-stat': item.key });
            stat.appendChild(createIcon(item.icon, '12px'));
            stat.appendChild(createElement('span', { class: 'suno-stat-label', text: item.label + ':' }));
            stat.appendChild(createElement('span', { class: 'suno-stat-value', text: '0' }));
            queueStatsContainer.appendChild(stat);
        });
        queueActionsBar.appendChild(queueStatsContainer);

        // Queue action buttons
        const queueBtnContainer = createElement('div', { class: 'suno-queue-buttons' });

        const fetchBtn = createElement('button', {
            class: 'suno-btn btn-info',
            id: 'queue-fetch-btn',
            'data-tooltip': 'Fetch tracks from current page'
        });
        fetchBtn.appendChild(createIcon('refresh'));
        fetchBtn.appendChild(createElement('span', { text: 'Fetch' }));
        fetchBtn.addEventListener('click', () => startQueueFetch());

        const downloadSelectedBtn = createElement('button', {
            class: 'suno-btn btn-success',
            id: 'queue-download-selected-btn',
            'data-tooltip': 'Download selected tracks'
        });
        downloadSelectedBtn.appendChild(createIcon('download'));
        downloadSelectedBtn.appendChild(createElement('span', { text: 'Download Selected' }));
        downloadSelectedBtn.addEventListener('click', () => downloadSelectedQueueTracks());

        const downloadAllBtn = createElement('button', {
            class: 'suno-btn btn-primary',
            id: 'queue-download-all-btn',
            'data-tooltip': 'Download all pending tracks'
        });
        downloadAllBtn.appendChild(createIcon('cloud-download'));
        downloadAllBtn.appendChild(createElement('span', { text: 'Download All' }));
        downloadAllBtn.addEventListener('click', () => showDownloadConfirmation());

        const clearQueueBtn = createElement('button', {
            class: 'suno-btn btn-danger',
            id: 'queue-clear-btn',
            'data-tooltip': 'Clear entire queue'
        });
        clearQueueBtn.appendChild(createIcon('trash'));
        clearQueueBtn.appendChild(createElement('span', { text: 'Clear' }));
        clearQueueBtn.addEventListener('click', async () => {
            const confirmed = await toastManager.confirm('Clear entire fetch queue?');
            if (confirmed) {
                clearFetchQueue();
                updateQueueTable();
                toastManager.info('Queue cleared');
            }
        });

        queueBtnContainer.appendChild(fetchBtn);
        queueBtnContainer.appendChild(downloadSelectedBtn);
        queueBtnContainer.appendChild(downloadAllBtn);
        queueBtnContainer.appendChild(clearQueueBtn);
        queueActionsBar.appendChild(queueBtnContainer);

        wrapper.appendChild(queueActionsBar);

        // Queue table scroll (hidden by default, shown when queue tab is active)
        const queueScroll = createElement('div', {
            id: 'suno-queue-table-scroll',
            class: 'suno-table-scroll tab-hidden'
        });

        const queueTable = buildTableSimple(QUEUE_TABLE);
        queueScroll.appendChild(queueTable);
        wrapper.appendChild(queueScroll);

        // Queue empty state (hidden by default, shown when queue tab is active and empty)
        const queueEmptyMsg = createElement('div', {
            id: 'suno-queue-empty',
            class: 'suno-track-empty tab-hidden'
        });
        queueEmptyMsg.appendChild(createIcon('cloud-download-outline', '48px'));
        queueEmptyMsg.appendChild(createElement('p', {
            text: 'No tracks in queue. Use "Fetch" to load tracks from the current page.'
        }));
        wrapper.appendChild(queueEmptyMsg);

        // Empty state message for track table
        const emptyMsg = createElement('div', {
            id: 'suno-track-empty',
            class: 'suno-track-empty',
            text: 'No tracks found. Start generating or download songs to see them here.'
        });
        emptyMsg.style.display = 'none';
        wrapper.appendChild(emptyMsg);

        trackTableModal.setContent(wrapper);

        // Add action buttons with tooltips
        trackTableModal.addButtons([
            {
                text: 'Queue Manager',
                icon: 'cloud-download',
                classes: ['suno-btn', 'btn-primary'],
                position: 'right',
                tooltip: 'Open the Download Queue Manager (bulk download interface)',
                onClick: () => {
                    trackTableModal.close();
                    showQueueModal();
                }
            },
            {
                text: 'Check Duplicates',
                icon: 'search',
                classes: ['suno-btn', 'btn-info'],
                position: 'right',
                tooltip: 'Compare imported files with track history to find duplicates',
                onClick: () => showDuplicateCheckModal()
            },
            {
                text: 'Export CSV',
                icon: 'fileExport',
                classes: ['suno-btn'],
                position: 'right',
                tooltip: 'Export all track history to a CSV file',
                onClick: exportTrackTableCSV
            },
            {
                text: 'Refresh',
                icon: 'refresh',
                classes: ['suno-btn', 'btn-info'],
                position: 'right',
                tooltip: 'Reload track history from storage',
                onClick: () => {
                    loadTrackHistory();
                    updateTrackTable();
                    toastManager.info('History refreshed');
                }
            },
            {
                text: 'Clear History',
                icon: 'trash',
                classes: ['suno-btn', 'btn-danger'],
                position: 'left',
                tooltip: 'Delete all track history (cannot be undone)',
                onClick: () => {
                    if (confirm('Clear all download history? This cannot be undone.')) {
                        clearDownloadHistory('all');
                        trackMetadata.clear();
                        updateTrackTable();
                        toastManager.success('History cleared');
                    }
                }
            },
            {
                text: 'Close',
                icon: 'xmark',
                classes: ['suno-btn', 'btn-danger'],
                position: 'left',
                tooltip: 'Close this modal',
                onClick: () => trackTableModal.close()
            }
        ]);

        // Mark modal for identification
        const overlay = trackTableModal.getOverlay();
        overlay.setAttribute('data-modal', 'track-status');

        trackTableModal.show();

        // Initialize table sorter - always create new one for fresh table
        trackTableSorter = new TableSorter(table, { key: 'downloadedAt', reverse: true });

        // Update table content
        updateTrackTable();
    };

    // Keep backward compatibility - createTrackTableContainer is now a no-op
    const createTrackTableContainer = () => {
        // No longer creates a panel - modal is created on demand
    };

    const updateTrackTable = () => {
        const table = document.querySelector('#suno-track-table');
        const statsRow = document.querySelector('#suno-track-stats');
        const emptyMsg = document.querySelector('#suno-track-empty');
        if (!table) return;

        // Get merged tracks from history and current session
        const tracks = getAllTracksForDisplay(trackTableFilter, trackTableSearch);
        const stats = getDownloadStats();

        // Enable/disable status button based on data
        const statusBtn = document.querySelector('#suno-toggle-status');
        if (statusBtn) statusBtn.disabled = false;

        // Update tab buttons with counts and disable state
        const tabCounts = {
            all: trackHistory.length,
            automation: stats.automationInHistory,
            bulk: stats.bulkInHistory,
            session: trackMetadata.size,
            queue: fetchQueue.length // Queue count from fetchQueue
        };

        const tabButtons = document.querySelectorAll('.suno-track-tabs .suno-tab-btn');
        tabButtons.forEach(btn => {
            const filterId = btn.dataset.filter;
            const count = tabCounts[filterId] ?? 0;
            const valueSpan = btn.querySelector('.suno-stat-value');
            if (valueSpan) valueSpan.textContent = count;

            // Disable tabs with 0 count (except 'all' and 'queue' - queue opens a modal)
            if (filterId !== 'all' && filterId !== 'queue') {
                btn.disabled = count === 0;
            }
        });

        // Update stats summary (hidden by default, but keep data in sync)
        if (statsRow) {
            statsRow.textContent = '';

            const statItems = [
                { label: 'Total', value: trackHistory.length, icon: 'music' },
                { label: 'Automation', value: stats.automationInHistory, icon: 'bolt' },
                { label: 'Bulk', value: stats.bulkInHistory, icon: 'cloudDownload' },
                { label: 'This Session', value: trackMetadata.size, icon: 'play' }
            ];

            statItems.forEach(item => {
                const stat = createElement('div', { class: 'suno-stat-item' });
                stat.appendChild(createIcon(item.icon));
                stat.appendChild(createElement('span', { class: 'suno-stat-label', text: item.label }));
                stat.appendChild(createElement('span', { class: 'suno-stat-value', text: item.value.toString() }));
                statsRow.appendChild(stat);
            });
        }

        // Show/hide empty state
        if (emptyMsg) {
            emptyMsg.style.display = tracks.length === 0 ? 'block' : 'none';
        }

        // Clear table body and rebuild rows using simplified schema
        clearTableBody(table);

        // Add rows - headers array controls column order
        tracks.forEach((track, index) => {
            addRowSimple(table, TRACK_TABLE, track, index, {
                rowClass: getTrackRowClass(track)
            });
        });
    };

    /**************************************************************
     *   DUPLICATE CHECKING FUNCTIONALITY
     **************************************************************/

    // Normalize track title/filename for matching (remove special chars, lowercase, etc.)
    const normalizeTrackNameForMatching = (name) => {
        if (!name) return '';
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .trim();
    };

    // Normalize filename for matching (remove extension, normalize)
    const normalizeFilenameForMatching = (filename) => {
        if (!filename) return '';
        const withoutExt = filename.replace(/\.(mp3|wav|m4a|flac|ogg)$/i, '');
        return normalizeTrackNameForMatching(withoutExt);
    };

    // Parse duration string to seconds ("3:24" -> 204)
    const parseDurationToSeconds = (durationStr) => {
        if (!durationStr || typeof durationStr !== 'string') return null;
        const parts = durationStr.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10) || 0;
            const seconds = parseInt(parts[1], 10) || 0;
            return minutes * 60 + seconds;
        }
        if (parts.length === 3) {
            const hours = parseInt(parts[0], 10) || 0;
            const minutes = parseInt(parts[1], 10) || 0;
            const seconds = parseInt(parts[2], 10) || 0;
            return hours * 3600 + minutes * 60 + seconds;
        }
        return null;
    };

    /**************************************************************
     *   DOWNLOADED MATCHES MODAL (No-Duple List Viewer)
     **************************************************************/

    const showDownloadedMatchesModal = () => {
        const matches = getAllDownloadedMatches();
        const matchesArray = Object.values(matches);

        const modal = new SunoModalBuilder('Downloaded Matches (No-Duple List)', {
            titleIcon: 'duplicate-outline',
            maxWidth: '900px',
            showBackButton: true,
            onBack: () => showDuplicateCheckModal(),
            showCloseButton: true
        });

        const content = createElement('div', { class: 'suno-duplicate-check-content' });

        // Stats
        const statsDiv = createElement('div', { class: 'suno-duplicate-stats' });
        statsDiv.appendChild(createElement('p', {
            text: `${matchesArray.length} tracks are marked as already downloaded. These will be skipped during bulk downloads.`
        }));
        content.appendChild(statsDiv);

        if (matchesArray.length === 0) {
            content.appendChild(createElement('div', {
                class: 'suno-modal-hint',
                text: 'No tracks have been marked as downloaded yet. Use the duplicate checker to match local files with Suno tracks.'
            }));
        } else {
            // Table of matches
            const scroll = createElement('div', { class: 'suno-table-scroll' });
            const table = createElement('table', { class: 'suno-table' });

            const thead = createElement('thead');
            const headerRow = createElement('tr');
            ['#', 'Track ID', 'Matched Filename', 'Duration', 'Size', 'Matched At', 'Remove'].forEach(h => {
                headerRow.appendChild(createElement('th', { text: h }));
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = createElement('tbody');
            matchesArray.forEach((match, index) => {
                const row = createElement('tr');

                row.appendChild(createElement('td', { text: (index + 1).toString() }));
                row.appendChild(createElement('td', {
                    text: match.id || '-',
                    title: match.id || '',
                    class: 'id-cell' // CSS handles truncation
                }));
                row.appendChild(createElement('td', {
                    text: match.filename || '-',
                    title: match.localPath || match.filename || ''
                }));
                row.appendChild(createElement('td', { text: match.duration || '-' }));
                row.appendChild(createElement('td', { text: match.fileSizeKB ? `${match.fileSizeKB} KB` : '-' }));
                row.appendChild(createElement('td', {
                    text: match.matchedAt ? new Date(match.matchedAt).toLocaleDateString() : '-'
                }));

                // Remove button
                const removeCell = createElement('td');
                const removeBtn = createElement('button', {
                    class: 'suno-btn btn-sm btn-danger',
                    title: 'Remove from no-duple list'
                });
                removeBtn.appendChild(createIcon('trash', '12px'));
                removeBtn.addEventListener('click', () => {
                    removeFromDownloadedMatches(match.id);
                    row.remove();
                    toastManager.info(`Removed "${match.filename}" from no-duple list`);
                });
                removeCell.appendChild(removeBtn);
                row.appendChild(removeCell);

                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            scroll.appendChild(table);
            content.appendChild(scroll);
        }

        modal.setContent(content);

        modal.addButtons([
            {
                text: 'Back',
                icon: 'arrow-back',
                classes: ['suno-btn'],
                position: 'left',
                onClick: () => {
                    modal.close();
                    showDuplicateCheckModal();
                }
            },
            {
                text: 'Clear All',
                icon: 'trash',
                classes: ['suno-btn', 'btn-danger'],
                position: 'right',
                tooltip: 'Remove all tracks from no-duple list',
                onClick: async () => {
                    const confirmed = await toastManager.confirm(`Clear all ${matchesArray.length} entries from the no-duple list?`);
                    if (confirmed) {
                        clearDownloadHistory('matches');
                        modal.close();
                        showDownloadedMatchesModal();
                    }
                }
            },
            {
                text: 'Export JSON',
                icon: 'download',
                classes: ['suno-btn'],
                position: 'right',
                tooltip: 'Export no-duple list as JSON',
                onClick: () => {
                    const data = JSON.stringify(matches, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = createElement('a', { href: url, download: 'suno-no-duple-list.json' });
                    a.click();
                    URL.revokeObjectURL(url);
                    toastManager.success('Exported no-duple list');
                }
            }
        ]);

        modal.show();
    };

    /**************************************************************
     *   DUPLICATE CHECK MODAL - MODULAR COMPONENT BUILDERS
     **************************************************************/

    // Build instructions hint group
    const _buildDuplicateInstructions = () => {
        const hint = createElement('div', { class: 'suno-modal-hint' });
        hint.appendChild(createElement('p', {
            text: '📁 Import your local audio files to find which Suno tracks you already have downloaded.'
        }));
        hint.appendChild(createElement('p', {
            text: '🔍 Matching uses filename + duration for accuracy. Mark matches to skip them in bulk downloads.'
        }));
        const matchCount = getDownloadedMatchesCount();
        if (matchCount > 0) {
            const countInfo = createElement('p', { class: 'text-success' });
            countInfo.appendChild(createIcon('checkmark-circle', '14px'));
            countInfo.appendChild(createElement('span', {
                text: ` ${matchCount} tracks are already in your no-duple list.`
            }));
            hint.appendChild(countInfo);
        }
        return hint;
    };

    // Build file upload group
    const _buildAudioFileUploadGroup = () => {
        const group = createElement('div', { class: 'suno-input-group' });

        const label = createElement('label', { text: 'Select Audio Files:' });

        const fileInput = createElement('input', {
            type: 'file',
            accept: '.mp3,.wav,.m4a,.flac,.ogg',
            multiple: 'true',
            id: 'duplicate-check-file-input',
            class: 'suno-input'
        });

        // Preview container for selected files
        const preview = createElement('div', {
            id: 'duplicate-file-preview',
            class: 'suno-file-preview'
        });
        preview.style.display = 'none';

        group.appendChild(label);
        group.appendChild(fileInput);
        group.appendChild(preview);

        return { group, fileInput, preview };
    };

    // Build results container
    const _buildDuplicateResultsContainer = () => {
        return createElement('div', {
            id: 'duplicate-check-results',
            class: 'suno-duplicate-results'
        });
    };

    // Format file size helper
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // Update file preview helper - basic version for raw File objects
    const updateFilePreview = (previewContainer, files) => {
        previewContainer.innerHTML = '';

        if (files.length === 0) {
            previewContainer.style.display = 'none';
            return;
        }

        previewContainer.style.display = 'block';

        const header = createElement('div', {
            class: 'suno-file-preview-header',
            text: `Selected ${files.length} file(s):`
        });
        previewContainer.appendChild(header);

        files.slice(0, 10).forEach(file => {
            const item = createElement('div', { class: 'suno-file-preview-item' });
            item.appendChild(createElement('span', { text: file.name }));
            item.appendChild(createElement('span', {
                text: formatFileSize(file.size)
            }));
            previewContainer.appendChild(item);
        });

        if (files.length > 10) {
            previewContainer.appendChild(createElement('div', {
                class: 'suno-file-preview-more',
                text: `...and ${files.length - 10} more`
            }));
        }
    };

    // Update file preview with extracted metadata (includes duration)
    const updateFilePreviewWithMetadata = (previewContainer, filesMetadata) => {
        previewContainer.innerHTML = '';

        if (filesMetadata.length === 0) {
            previewContainer.style.display = 'none';
            return;
        }

        previewContainer.style.display = 'block';

        const header = createElement('div', {
            class: 'suno-file-preview-header'
        });
        header.appendChild(createIcon('musical-notes', '14px'));
        header.appendChild(createElement('span', { text: ` ${filesMetadata.length} audio file(s) imported:` }));
        previewContainer.appendChild(header);

        // Summary stats
        const totalSize = filesMetadata.reduce((acc, f) => acc + f.fileSize, 0);
        const withDuration = filesMetadata.filter(f => f.duration).length;

        const statsDiv = createElement('div', { class: 'suno-file-preview-stats' });
        statsDiv.appendChild(createElement('span', { text: `Total: ${formatFileSize(totalSize)}` }));
        if (withDuration > 0) {
            statsDiv.appendChild(createElement('span', { text: ` • ${withDuration} with duration data` }));
        }
        previewContainer.appendChild(statsDiv);

        // File list with metadata
        filesMetadata.slice(0, 10).forEach(file => {
            const item = createElement('div', { class: 'suno-file-preview-item' });

            const nameSpan = createElement('span', {
                class: 'suno-file-name',
                text: file.filename,
                title: file.localPath || file.filename
            });
            item.appendChild(nameSpan);

            const metaSpan = createElement('span', { class: 'suno-file-meta' });
            if (file.duration) {
                metaSpan.appendChild(createElement('span', { text: file.duration }));
                metaSpan.appendChild(createElement('span', { text: ' • ' }));
            }
            metaSpan.appendChild(createElement('span', { text: formatFileSize(file.fileSize) }));
            item.appendChild(metaSpan);

            previewContainer.appendChild(item);
        });

        if (filesMetadata.length > 10) {
            previewContainer.appendChild(createElement('div', {
                class: 'suno-file-preview-more',
                text: `...and ${filesMetadata.length - 10} more`
            }));
        }
    };

    // Show duplicate check modal
    const showDuplicateCheckModal = () => {
        // 1. Build modular components
        const instructions = _buildDuplicateInstructions();
        const { group: fileGroup, fileInput, preview } = _buildAudioFileUploadGroup();
        const resultsContainer = _buildDuplicateResultsContainer();

        // Build extraction progress table (shows live data as files are processed)
        const extractionContainer = createElement('div', {
            id: 'extraction-progress-container',
            class: 'suno-input-group',
            style: { display: 'none' }
        });
        const extractionHeader = createElement('label', { icon: 'analytics', text: 'Extracted File Data:' });
        const extractionScroll = createElement('div', { class: 'suno-table-scroll', style: { maxHeight: '50vh' } });
        const extractionTable = createElement('table', { class: 'suno-table', id: 'extraction-table' });
        const extractionThead = createElement('thead');
        const extractionHeaderRow = createElement('tr');
        ['#', 'Filename', 'Duration', 'Size', 'Status'].forEach(h => {
            extractionHeaderRow.appendChild(createElement('th', { text: h }));
        });
        extractionThead.appendChild(extractionHeaderRow);
        extractionTable.appendChild(extractionThead);
        extractionTable.appendChild(createElement('tbody', { id: 'extraction-table-body' }));
        extractionScroll.appendChild(extractionTable);
        extractionContainer.appendChild(extractionHeader);
        extractionContainer.appendChild(extractionScroll);

        // 2. Create modal with back navigation
        const modal = new SunoModalBuilder('Check Duplicates & Mark Downloaded', {
            titleIcon: 'search',
            maxWidth: '950px',
            showBackButton: true,
            onBack: () => showTrackTableModal(),
            showCloseButton: true
        });

        // 3. Assemble content
        const content = createElement('div', { class: 'suno-duplicate-check-content' });
        content.appendChild(instructions);
        content.appendChild(fileGroup);
        content.appendChild(extractionContainer); // Live extraction data
        content.appendChild(resultsContainer);
        modal.setContent(content);

        // 4. Define handlers BEFORE button creation (YT pattern)
        let selectedFiles = [];
        let extractedMetadata = [];
        let isExtracting = false;

        // Helper to update extraction table row
        const updateExtractionRow = (index, file, status = 'extracting') => {
            const tbody = document.getElementById('extraction-table-body');
            if (!tbody) return;

            let row = tbody.querySelector(`tr[data-index="${index}"]`);
            if (!row) {
                row = createElement('tr', { 'data-index': index.toString() });
                row.appendChild(createElement('td', { text: (index + 1).toString() }));
                row.appendChild(createElement('td', { text: file.filename || file.name, class: 'filename-cell' }));
                row.appendChild(createElement('td', { text: '-', class: 'duration-cell' }));
                row.appendChild(createElement('td', { text: formatFileSize(file.fileSize || file.size), class: 'size-cell' }));
                row.appendChild(createElement('td', { class: 'status-cell' }));
                tbody.appendChild(row);
            }

            // Update cells
            const durationCell = row.querySelector('.duration-cell');
            const statusCell = row.querySelector('.status-cell');

            if (file.duration) {
                durationCell.textContent = file.duration;
            }

            statusCell.textContent = '';
            if (status === 'extracting') {
                statusCell.appendChild(createIcon('hourglass', '12px'));
            } else if (status === 'done') {
                statusCell.appendChild(createIcon('checkmark-circle', '12px'));
                statusCell.classList.add('text-success');
            } else if (status === 'error') {
                statusCell.appendChild(createIcon('alert-circle', '12px'));
                statusCell.classList.add('text-danger');
            }
        };

        const handleFileSelect = async (e) => {
            selectedFiles = Array.from(e.target.files);

            if (selectedFiles.length === 0) {
                updateFilePreview(preview, []);
                extractionContainer.style.display = 'none';
                updateCheckButtonState();
                return;
            }

            // Show basic preview first
            updateFilePreview(preview, selectedFiles);
            updateCheckButtonState();

            // Show extraction table and clear previous data
            extractionContainer.style.display = 'block';
            const tbody = document.getElementById('extraction-table-body');
            if (tbody) tbody.textContent = '';

            // Pre-populate table with all files (status: pending)
            selectedFiles.forEach((file, i) => {
                updateExtractionRow(i, file, 'extracting');
            });

            // Extract metadata in background with progress
            isExtracting = true;
            const checkBtn = document.getElementById('duplicate-check-btn');
            if (checkBtn) {
                checkBtn.textContent = 'Extracting metadata...';
                checkBtn.disabled = true;
            }

            try {
                extractedMetadata = await extractAudioFilesMetadata(selectedFiles, (current, total, file) => {
                    // Update button
                    if (checkBtn) {
                        checkBtn.textContent = `Extracting ${current}/${total}...`;
                    }
                    // Update table row with extracted data
                    updateExtractionRow(current - 1, file, 'done');
                });

                // Update preview with full metadata
                updateFilePreviewWithMetadata(preview, extractedMetadata);

                // Cache imported files for future use
                addToImportedFilesCache(extractedMetadata);

            } catch (err) {
                console.error('Metadata extraction error:', err);
                toastManager.warning('Some files could not be analyzed');
            }

            isExtracting = false;
            updateCheckButtonState();
        };

        const handleCheck = () => {
            if (selectedFiles.length === 0 || isExtracting) {
                toastManager.warning('Please wait for file analysis to complete');
                return;
            }
            performDuplicateCheck(extractedMetadata, resultsContainer, modal);
        };

        const updateCheckButtonState = () => {
            const checkBtn = document.getElementById('duplicate-check-btn');
            if (checkBtn) {
                const disabled = selectedFiles.length === 0 || isExtracting;
                checkBtn.disabled = disabled;
                checkBtn.style.opacity = disabled ? '0.5' : '1';
                if (!isExtracting) {
                    checkBtn.textContent = '';
                    checkBtn.appendChild(createIcon('duplicate-outline'));
                    checkBtn.appendChild(createElement('span', { text: ' Check for Duplicates' }));
                }
            }
        };

        // 5. Attach file input handler
        fileInput.addEventListener('change', handleFileSelect);

        // 6. Add buttons to actions bar (YT pattern: left=close, right=action)
        modal.addButtons([
            {
                text: 'Close',
                icon: 'close',
                classes: ['suno-btn'],
                position: 'left',
                tooltip: 'Close and return to track history',
                onClick: () => modal.close()
            },
            {
                id: 'view-matches-btn',
                text: 'View No-Duple List',
                icon: 'list',
                classes: ['suno-btn'],
                position: 'left',
                tooltip: `View ${getDownloadedMatchesCount()} tracks marked as already downloaded`,
                onClick: () => showDownloadedMatchesModal()
            },
            {
                id: 'duplicate-check-btn',
                text: 'Check for Duplicates',
                icon: 'checkmark-done',
                classes: ['suno-btn', 'btn-primary'],
                position: 'right',
                tooltip: 'Compare selected files with track history',
                onClick: handleCheck
            }
        ]);

        modal.show();

        // 7. Initially disable check button (after modal is shown)
        setTimeout(updateCheckButtonState, 0);
    };

    // Perform duplicate check - accepts metadata objects from extractAudioFilesMetadata
    const performDuplicateCheck = (filesMetadata, resultsContainer, modal) => {
        resultsContainer.innerHTML = '';

        // Show loading state
        const loadingDiv = createElement('div', {
            class: 'suno-modal-hint',
            text: 'Analyzing matches...'
        });
        resultsContainer.appendChild(loadingDiv);

        // Get all tracks from history
        const allTracks = getAllTracksForDisplay('all', '');

        // Enhanced comparison: filename + duration + filesize
        const comparisonResults = allTracks.map(track => {
            const trackTitle = track.title || track.name || '';
            const normalizedTrackTitle = normalizeTrackNameForMatching(trackTitle);
            const trackDuration = track.duration; // "3:24" format
            const trackDurationSec = parseDurationToSeconds(trackDuration);

            let matchType = 'none';
            let matchedFile = null;
            let matchConfidence = 0;

            for (const imported of filesMetadata) {
                const filenameMatch = normalizedTrackTitle === imported.normalized ||
                    normalizedTrackTitle.includes(imported.normalized) ||
                    imported.normalized.includes(normalizedTrackTitle);

                const durationMatch = imported.durationSeconds && trackDurationSec &&
                    Math.abs(imported.durationSeconds - trackDurationSec) <= 2; // 2 sec tolerance

                // Calculate confidence score
                let confidence = 0;
                if (filenameMatch) confidence += 50;
                if (durationMatch) confidence += 40;
                // Size match is less reliable for audio (encoding differences)

                if (confidence > matchConfidence) {
                    matchConfidence = confidence;
                    matchedFile = imported;

                    if (filenameMatch && durationMatch) {
                        matchType = 'strong'; // High confidence
                    } else if (filenameMatch) {
                        matchType = 'filename'; // Medium confidence
                    } else if (durationMatch) {
                        matchType = 'duration'; // Low confidence (duration alone)
                    }
                }
            }

            const isDuplicate = matchType !== 'none' && matchConfidence >= 50;
            const isAlreadyMarked = isTrackInDownloadedMatches(track.id);

            return {
                ...track,
                isDuplicate,
                isAlreadyMarked,
                matchType,
                matchConfidence,
                matchedFile,
                status: isAlreadyMarked ? 'Marked' : (isDuplicate ? 'Duplicate' : 'Unique')
            };
        });

        const duplicates = comparisonResults.filter(r => r.isDuplicate && !r.isAlreadyMarked);
        const alreadyMarked = comparisonResults.filter(r => r.isAlreadyMarked);
        const unique = comparisonResults.filter(r => !r.isDuplicate && !r.isAlreadyMarked);
        const unmatchedImported = filesMetadata.filter(imported => {
            return !comparisonResults.some(track => {
                const trackTitle = track.title || track.name || '';
                const normalizedTrackTitle = normalizeTrackNameForMatching(trackTitle);
                return normalizedTrackTitle === imported.normalized ||
                    normalizedTrackTitle.includes(imported.normalized) ||
                    imported.normalized.includes(normalizedTrackTitle);
            });
        });

        // Clear loading and display results
        resultsContainer.innerHTML = '';

        // Build stats using YT pattern (no innerHTML)
        const statsDiv = createElement('div', { class: 'suno-duplicate-stats' });
        statsDiv.appendChild(createElement('h3', { icon: 'bar-chart', text: 'Comparison Results' }));

        const statsRows = [
            { label: 'Imported files:', value: filesMetadata.length, icon: 'cloud-upload-sharp' },
            { label: 'New duplicates:', value: duplicates.length, icon: 'duplicate-outline' },
            { label: 'Already marked:', value: alreadyMarked.length, icon: 'checkmark-circle-outline' },
            { label: 'Unique in Suno:', value: unique.length, icon: 'createMusic' },
            { label: 'Unmatched local:', value: unmatchedImported.length, icon: 'close-circle-outline' }
        ];

        statsRows.forEach(row => {
            const div = createElement('div');
            div.classList.add('suno-stat-item');
            div.appendChild(createIcon(row.icon, '14px'));
            div.appendChild(createElement('span', { text: row.label, class: 'suno-stat-label' }));
            div.appendChild(createElement('strong', { text: ' ' + row.value.toString(), class: 'suno-stat-value' }));
            statsDiv.appendChild(div);
        });
        resultsContainer.appendChild(statsDiv);

        // Action buttons row
        if (duplicates.length > 0) {
            const actionRow = createElement('div', { class: 'suno-button-row' });

            const markAllBtn = createElement('button', { class: 'suno-btn suno-btn-secondary suno-btn-grad' });
            markAllBtn.appendChild(createIcon('checkmark-done'));
            markAllBtn.appendChild(createElement('span', { text: ` Mark All ${duplicates.length} as Downloaded` }));
            markAllBtn.addEventListener('click', () => {
                let marked = 0;
                duplicates.forEach(dup => {
                    if (dup.id && dup.matchedFile) {
                        addToDownloadedMatches({
                            id: dup.id,
                            filename: dup.matchedFile.filename,
                            duration: dup.matchedFile.duration,
                            durationSeconds: dup.matchedFile.durationSeconds,
                            fileSize: dup.matchedFile.fileSize,
                            localPath: dup.matchedFile.localPath,
                            downloadedAt: Date.now()
                        });
                        marked++;
                    }
                });
                toastManager.success(`Marked ${marked} tracks as downloaded (no-duple list)`);
                // Refresh the check
                performDuplicateCheck(filesMetadata, resultsContainer, modal);
            });

            actionRow.appendChild(markAllBtn);
            resultsContainer.appendChild(actionRow);
        }

        // Build duplicates table if any
        if (duplicates.length > 0) {
            const tableSection = createElement('div', { class: 'suno-input-group' });
            tableSection.appendChild(createElement('label', { text: `New Duplicates Found (${duplicates.length}):` }));

            const scroll = createElement('div', { class: 'suno-table-scroll' });
            const table = createElement('table', { class: 'suno-table' });

            // Build thead
            const thead = createElement('thead');
            const headerRow = createElement('tr');
            ['', 'Track Name', 'Matched File', 'Duration', 'Confidence', 'Action'].forEach(header => {
                headerRow.appendChild(createElement('th', { text: header }));
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Build tbody
            const tbody = createElement('tbody');
            duplicates.forEach((track, index) => {
                const row = createElement('tr', { class: 'suno-duplicate-row' });

                // Index
                row.appendChild(createElement('td', { text: (index + 1).toString(), class: 'index-cell' }));

                // Track name
                const titleCell = createElement('td', { class: 'title-cell' });
                titleCell.appendChild(createElement('span', { text: track.title || track.name || 'Unknown' }));
                if (track.id) {
                    titleCell.appendChild(createElement('small', {
                        text: ` (${track.id})`,
                        class: 'text-muted id-inline',
                        title: track.id
                    }));
                }
                row.appendChild(titleCell);

                // Matched file
                const matchedCell = createElement('td', { class: 'matched-file-cell' });
                if (track.matchedFile) {
                    matchedCell.appendChild(createElement('span', {
                        text: track.matchedFile.filename,
                        title: track.matchedFile.localPath || track.matchedFile.filename
                    }));
                } else {
                    matchedCell.textContent = '-';
                }
                row.appendChild(matchedCell);

                // Duration comparison
                const durationCell = createElement('td', { class: 'duration-cell' });
                const trackDur = track.duration || '?';
                const fileDur = track.matchedFile?.duration || '?';
                durationCell.textContent = `${trackDur} / ${fileDur}`;
                row.appendChild(durationCell);

                // Confidence
                const confCell = createElement('td', { class: 'confidence-cell' });
                const confBadge = createElement('span', {
                    class: `suno-badge ${track.matchType === 'strong' ? 'badge-success' : 'badge-warning'}`,
                    text: `${track.matchConfidence}%`
                });
                confCell.appendChild(confBadge);
                row.appendChild(confCell);

                // Action button
                const actionCell = createElement('td', { class: 'action-cell' });
                const markBtn = createElement('button', {
                    class: 'suno-btn btn-sm',
                    title: 'Mark as downloaded'
                });
                markBtn.appendChild(createIcon('checkmark', '12px'));
                markBtn.addEventListener('click', () => {
                    if (track.id && track.matchedFile) {
                        addToDownloadedMatches({
                            id: track.id,
                            filename: track.matchedFile.filename,
                            duration: track.matchedFile.duration,
                            durationSeconds: track.matchedFile.durationSeconds,
                            fileSize: track.matchedFile.fileSize,
                            localPath: track.matchedFile.localPath,
                            downloadedAt: Date.now()
                        });
                        row.remove();
                        toastManager.success(`Marked "${track.title}" as downloaded`);
                    }
                });
                actionCell.appendChild(markBtn);
                row.appendChild(actionCell);

                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            scroll.appendChild(table);
            tableSection.appendChild(scroll);
            resultsContainer.appendChild(tableSection);
        }

        // Already marked section
        if (alreadyMarked.length > 0) {
            const markedSection = createElement('div', { class: 'suno-input-group' });
            markedSection.appendChild(createElement('label', {
                text: `Already in No-Duple List (${alreadyMarked.length}):`,
                class: 'text-success'
            }));

            const markedList = createElement('ul', { class: 'suno-unmatched-list suno-marked-list' });
            alreadyMarked.slice(0, 10).forEach(track => {
                const li = createElement('li');
                li.appendChild(createIcon('checkmark-circle', '12px'));
                li.appendChild(createElement('span', { text: ' ' + (track.title || track.name || 'Unknown') }));
                markedList.appendChild(li);
            });
            if (alreadyMarked.length > 10) {
                markedList.appendChild(createElement('li', {
                    text: `...and ${alreadyMarked.length - 10} more`,
                    class: 'text-muted'
                }));
            }
            markedSection.appendChild(markedList);
            resultsContainer.appendChild(markedSection);
        }

        // Unmatched imported files section
        if (unmatchedImported.length > 0) {
            const unmatchedSection = createElement('div', { class: 'suno-input-group' });
            unmatchedSection.appendChild(createElement('label', {
                text: `Local Files Not Found in Suno (${unmatchedImported.length}):`
            }));

            const unmatchedList = createElement('ul', { class: 'suno-unmatched-list' });
            unmatchedImported.slice(0, 15).forEach(imported => {
                const li = createElement('li');
                li.appendChild(createIcon('help-circle-outline', '12px'));
                li.appendChild(createElement('span', { text: ' ' + imported.filename, class: 'unmatched-file-cell' }));
                if (imported.duration) {
                    li.appendChild(createElement('span', {
                        text: ` (${imported.duration}, ${formatFileSize(imported.fileSize)})`,
                        class: 'text-muted'
                    }));
                }
                unmatchedList.appendChild(li);
            });
            if (unmatchedImported.length > 15) {
                unmatchedList.appendChild(createElement('li', {
                    text: `...and ${unmatchedImported.length - 15} more`,
                    class: 'text-muted'
                }));
            }
            unmatchedSection.appendChild(unmatchedList);
            resultsContainer.appendChild(unmatchedSection);
        }

        // Show success message
        if (duplicates.length === 0 && unmatchedImported.length === filesMetadata.length) {
            toastManager.info('No duplicates found - all files are new');
        } else if (duplicates.length > 0) {
            toastManager.success(`Found ${duplicates.length} duplicate(s) in your track history`);
        }
    };

    /**************************************************************
     *   TEXTAREA VALIDATION
     **************************************************************/
    const initializeTextareaValidation = () => {
        const textarea = getPromptTextarea();
        const createButton = findCreateButton();

        if (!textarea || !createButton) {
            setTimeout(initializeTextareaValidation, 1000);
            return;
        }

        // Validate textarea silently
        const validateTextarea = () => {
            const currentTextarea = getPromptTextarea();
            if (!currentTextarea) return;

            const value = getPromptValue();
            createButton.disabled = !value;
        };

        textarea.addEventListener('input', validateTextarea);
        textarea.addEventListener('change', validateTextarea);

        const modeButtons = Array.from(document.querySelectorAll('button')).filter(b => {
            const text = (b.textContent || b.innerText || '').trim();
            return text === 'Simple' || text === 'Custom';
        });
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => setTimeout(validateTextarea, 300));
        });

        validateTextarea();
    };

    /**************************************************************
     *   403 ERROR TRACKING
     **************************************************************/
    const setup403Tracking = () => {
        if (window._sunoAutoFetchPatched) return;

        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            if (response.status === 403) {
                total403s++;
                consecutive403s++;
                log(`⚠️ 403 error detected (total: ${total403s}, consecutive: ${consecutive403s}) - continuing...`);
            } else if (response.ok) {
                consecutive403s = 0;
            }
            return response;
        };
        window._sunoAutoFetchPatched = true;
        //log('✓ 403 error tracking enabled');
    };

    /**************************************************************
     *   WAIT FOR GENERATION
     **************************************************************/
    const waitForGenerationStart = async (timeoutMs = 20000) => {
        const startTime = Date.now();
        const initialRowCount = document.querySelectorAll('[data-testid="clip-row"]').length;

        log(`⏳ Waiting for generation to start (initial rows: ${initialRowCount})...`);

        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (Date.now() - startTime > timeoutMs) {
                    clearInterval(checkInterval);
                    log(`TIMEOUT: Waiting for generation start`);
                    resolve({ success: false, reason: 'timeout' });
                    return;
                }

                const currentRowCount = document.querySelectorAll('[data-testid="clip-row"]').length;
                if (currentRowCount > initialRowCount) {
                    clearInterval(checkInterval);
                    log(`SUCCESS: Generation started (new rows: ${currentRowCount})`);
                    resolve({ success: true });
                }
            }, 500);
        });
    };

    /**************************************************************
     *   CLICK BUTTON WITH GENERATION TRACKING
     **************************************************************/
    const clickButton = async () => {
        try {
            const button = findCreateButton();
            if (!button) {
                log('❌ Create button not found');
                return false;
            }
            if (button.disabled) {
                log('WARNING: Create button is disabled');
                return false;
            }

            log(`🖱️ Clicking Create button (#${totalClicks + 1})...`);

            const clicked = safeClick(button);
            if (!clicked) {
                log('ERROR: Failed to click button');
                return false;
            }

            const result = await waitForGenerationStart(20000);

            if (!result.success) {
                log(`⚠️ Generation may not have started: ${result.reason}`);
            }

            log(`Clicked Create button (#${totalClicks + 1})`);
            return true;
        } catch (error) {
            log(`❌ Click error: ${error.message}`);
            return false;
        }
    };

    /**************************************************************
     *   PERFORM CLICKS
     **************************************************************/
    const performClicks = async () => {
        // Enable the stop and pause buttons in the toolpanel
        const stopBtn = document.querySelector('#stop-clicks-button');
        const pauseBtn = document.querySelector('#pause-automation-button');
        if (stopBtn) stopBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = false;

        while (!stopClicks && (CLICK_LIMIT === 0 || totalClicks < CLICK_LIMIT)) {
            // Check if paused
            while (window.automationPaused && !stopClicks) {
                await sleep(500);
                updateNotification(CLICK_LIMIT - totalClicks, dataKeyQueue.length);
            }

            if (stopClicks) break;

            const promptValue = getPromptValue();
            if (!promptValue) {
                log('WARNING: Textarea is empty - stopping clicks');
                break;
            }

            const textarea = getPromptTextarea();
            if (!textarea) {
                log('⚠️ Textarea not found - waiting...');
                await sleep(2000);
                continue;
            }

            const currentValue = (textarea.value || '').trim();
            if (currentValue !== promptValue) {
                log(`Textarea value mismatch, re-applying...`);
                const setOk = await setTextareaValueHuman(textarea, promptValue);
                if (!setOk) {
                    log('❌ Failed to set textarea value - skipping this click');
                    await sleep(2000);
                    continue;
                }

                const verifyValue = getPromptValue();
                if (verifyValue !== promptValue) {
                    log(`❌ Verification failed. Expected: "${promptValue}", Got: "${verifyValue}"`);
                    await sleep(2000);
                    continue;
                }
            }

            const success = await clickButton();

            if (success) {
                totalClicks++;
                updateNotification(CLICK_LIMIT - totalClicks, dataKeyQueue.length);
            } else {
                log('WARNING: Click failed, but continuing...');
            }

            const delay = 2000 + randomDelay(0, 1000);
            await sleep(delay);

            if (totalClicks % 10 === 0 && totalClicks > 0) {
                log('⏸ Taking a break (every 10 clicks)...');
                await sleep(120000);
            }

            if (consecutive403s >= 3) {
                log(`⏸ Too many 403s (${consecutive403s}), adding extra delay...`);
                await sleep(5000);
            }
        }

        log('✓ Click loop finished');
    };

    /**************************************************************
     *   START SCRIPT WITH PROMPTS
     **************************************************************/
    const showAutomationModal = () => {
        return new Promise((resolve) => {
            const modal = new SunoModalBuilder('Start Automation', {
                titleIcon: 'createMusic',
                maxWidth: '550px',
                draggable: false
            });

            // Add suno-modal class to overlay for styling
            const overlay = modal.getOverlay();
            overlay.classList.add('suno-modal');

            // Create content with input fields
            const content = document.createElement('div');
            content.className = 'suno-settings-content';

            // Instructions
            const instructions = document.createElement('p');
            instructions.className = 'suno-modal-hint';
            instructions.textContent = 'Configure the automation settings. Set to 0 for unlimited.';
            content.appendChild(instructions);

            // Click limit input
            const clickGroup = document.createElement('div');
            clickGroup.className = 'suno-input-group';

            const clickLabel = document.createElement('label');
            clickLabel.textContent = 'Number of Clicks';

            const clickInput = document.createElement('input');
            clickInput.type = 'number';
            clickInput.value = '10';
            clickInput.min = '0';
            clickInput.step = '1';
            clickInput.id = 'modal-click-limit';

            clickGroup.appendChild(clickLabel);
            clickGroup.appendChild(clickInput);
            // Enhance with custom buttons
            enhanceNumberInput(clickInput);
            content.appendChild(clickGroup);

            // Download limit input
            const downloadGroup = document.createElement('div');
            downloadGroup.className = 'suno-input-group';

            const downloadLabel = document.createElement('label');
            downloadLabel.textContent = 'Number of Downloads';

            const downloadInput = document.createElement('input');
            downloadInput.type = 'number';
            downloadInput.value = '0';
            downloadInput.step = '1';
            downloadInput.min = '0';
            downloadInput.id = 'modal-download-limit';

            downloadGroup.appendChild(downloadLabel);
            downloadGroup.appendChild(downloadInput);
            // Enhance with custom buttons
            enhanceNumberInput(downloadInput);
            content.appendChild(downloadGroup);

            modal.addContent(content);
            modal.addButtons([
                {
                    text: 'Cancel',
                    icon: 'close',
                    classes: ['suno-btn'],
                    position: 'left',
                    onClick: () => {
                        modal.close(null);
                    }
                },
                {
                    text: 'Start Generating',
                    icon: 'createMusic',
                    classes: ['suno-btn', 'btn-primary'],
                    full: true,
                    position: 'right',
                    onClick: () => {
                        const clicks = parseInt(clickInput.value, 10) || 0;
                        const downloads = parseInt(downloadInput.value, 10) || 0;
                        modal.close({ clicks, downloads });
                    }
                }
            ]);

            modal.show().then(resolve);
        });
    };

    /**************************************************************
     *   SETTINGS MODAL
     **************************************************************/
    /**************************************************************
     *   UI COMPONENT BUILDERS
     **************************************************************/

    // Create a summary table with collapsible rows
    const createSummaryTable = (options = {}) => {
        const { title, icon, rows = [], collapsible = false, id } = options;

        const table = document.createElement('div');
        table.className = 'suno-summary-table';
        if (id) table.id = id;

        // Title bar
        const titleBar = document.createElement('div');
        titleBar.className = 'suno-summary-title';

        const h3 = document.createElement('h3');
        if (icon) h3.appendChild(createIcon(icon, '14px'));

        const titleSpan = document.createElement('span');
        titleSpan.textContent = title;
        h3.appendChild(titleSpan);

        if (collapsible) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'suno-btn suno-btn-icon';
            toggleBtn.appendChild(createIcon('eye', '14px'));
            toggleBtn.addEventListener('click', () => {
                table.classList.toggle('hide');
                updateIcon(toggleBtn, table.classList.contains('hide') ? 'eyeSlash' : 'eye');
            });
            h3.appendChild(toggleBtn);
        }

        titleBar.appendChild(h3);
        table.appendChild(titleBar);

        // Rows container
        const rowsContainer = document.createElement('div');
        rowsContainer.className = 'suno-summary-rows';

        rows.forEach(rowData => {
            const row = document.createElement('div');
            row.className = 'suno-row';

            if (rowData.icon) {
                // Use createIcon for proper icon rendering (Ionicons or SVG)
                const iconEl = createIcon(rowData.icon, '14px');
                row.appendChild(iconEl);
            }

            const label = document.createElement('span');
            label.className = 'suno-row-label';
            label.textContent = rowData.label;
            row.appendChild(label);

            const result = document.createElement('span');
            result.className = 'suno-row-result';
            if (rowData.id) result.id = rowData.id;

            const strong = document.createElement('strong');
            strong.textContent = rowData.value;
            result.appendChild(strong);

            if (rowData.suffix) {
                result.appendChild(document.createTextNode(` ${rowData.suffix}`));
            }

            row.appendChild(result);
            rowsContainer.appendChild(row);
        });

        table.appendChild(rowsContainer);
        return table;
    };

    // Create a form group with toggle
    const createFormGroupToggle = (options = {}) => {
        const { title, description, checked = false, onChange } = options;

        const group = document.createElement('div');
        group.className = 'suno-form-group';

        const container = document.createElement('div');
        container.className = 'suno-toggle-container';

        const textDiv = document.createElement('div');

        const h3 = document.createElement('h3');
        h3.textContent = title;
        textDiv.appendChild(h3);

        if (description) {
            const p = document.createElement('p');
            p.textContent = description;
            textDiv.appendChild(p);
        }

        container.appendChild(textDiv);

        // Toggle switch using CSS classes
        const toggle = document.createElement('label');
        toggle.className = 'suno-toggle';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = checked;

        const slider = document.createElement('span');
        slider.className = 'suno-toggle-slider';

        input.addEventListener('change', () => {
            if (onChange) onChange(input.checked);
        });

        toggle.appendChild(input);
        toggle.appendChild(slider);
        container.appendChild(toggle);

        group.appendChild(container);
        return group;
    };

    // Create action buttons section
    const createActionSection = (options = {}) => {
        const { title, icon, buttons = [] } = options;

        const section = document.createElement('div');
        section.className = 'suno-form-group suno-action-section';

        if (title) {
            const titleEl = document.createElement('div');
            titleEl.className = 'suno-action-title';
            if (icon) {
                // Use createIcon for proper icon rendering
                titleEl.appendChild(createIcon(icon, '14px'));
                titleEl.appendChild(document.createTextNode(` ${title}`));
            } else {
                titleEl.textContent = title;
            }
            section.appendChild(titleEl);
        }

        const btnContainer = document.createElement('div');
        btnContainer.className = 'suno-action-buttons';

        buttons.forEach(btnConfig => {
            const btn = document.createElement('button');
            btn.className = `suno-btn ${btnConfig.classes || ''}`.trim();
            if (btnConfig.full) btn.classList.add('suno-btn-full');

            // Add icon if provided, otherwise use default based on text
            if (btnConfig.icon) {
                btn.appendChild(createIcon(btnConfig.icon, '14px'));
            } else if (btnConfig.text) {
                // Default icons based on button text
                const defaultIcon = getDefaultButtonIcon(btnConfig.text);
                if (defaultIcon) {
                    btn.appendChild(createIcon(defaultIcon, '14px'));
                }
            }

            if (btnConfig.text) {
                const textSpan = document.createElement('span');
                textSpan.className = 'suno-btn-text';
                textSpan.textContent = btnConfig.text;
                btn.appendChild(textSpan);
            }

            if (btnConfig.onClick) btn.addEventListener('click', btnConfig.onClick);
            btnContainer.appendChild(btn);
        });

        section.appendChild(btnContainer);
        return section;
    };

    const showSettingsModal = () => {
        const modal = new SunoModalBuilder('Settings', {
            titleIcon: 'settings',
            maxWidth: '600px',
            draggable: false
        });

        const content = document.createElement('div');
        content.className = 'suno-settings-content';

        // Download Statistics Section
        const stats = getDownloadStats();
        const now = new Date();

        const statsTable = createSummaryTable({
            title: 'Download Statistics',
            icon: 'barChart',
            collapsible: true,
            rows: [
                { icon: 'flash', label: 'Automation downloads:', value: stats.automationDownloaded, suffix: 'tracks' },
                { icon: 'cloudDownload', label: 'Bulk downloads:', value: stats.bulkDownloaded, suffix: 'tracks' },
                { icon: 'errorCircle', label: 'Failed downloads:', value: '0' },
                { icon: 'calendar', label: 'Date:', value: now.toLocaleDateString() },
                { icon: 'time', label: 'Time:', value: now.toLocaleTimeString() }
            ]
        });
        content.appendChild(statsTable);

        // Gradient Buttons Toggle
        const gradientToggle = createFormGroupToggle({
            title: 'Gradient Buttons',
            description: 'Apply gradient styling to buttons',
            checked: GM_getValue(GM_KEYS.gradientButtons, false),
            onChange: (checked) => {
                GM_setValue(GM_KEYS.gradientButtons, checked);
                const panel = document.querySelector('#suno-panel');
                if (panel) panel.classList.toggle('suno-gradient-btn', checked);
            }
        });
        content.appendChild(gradientToggle);

        // Optimize UI (disable transitions/overlays)
        const optimizeToggle = createFormGroupToggle({
            title: 'Optimize UI (disable transitions)',
            description: 'Reduce animations/overlays to improve performance',
            checked: GM_getValue(GM_KEYS.optimizeUI, false),
            onChange: (checked) => {
                GM_setValue(GM_KEYS.optimizeUI, checked);
                applyOptimizeUI();
            }
        });
        content.appendChild(optimizeToggle);

        // Disable backdrop blur
        const blurToggle = createFormGroupToggle({
            title: 'Disable Backdrop Blur',
            description: 'Turn off modal/tooltips blur to reduce GPU load',
            checked: GM_getValue(GM_KEYS.disableBlur, false),
            onChange: (checked) => {
                GM_setValue(GM_KEYS.disableBlur, checked);
                applyBlurToggle();
            }
        });
        content.appendChild(blurToggle);

        // Tooltips Toggle
        const tooltipsToggle = createFormGroupToggle({
            title: 'Show Tooltips',
            description: 'Display tooltips on hover',
            checked: GM_getValue(GM_KEYS.tooltipsEnabled, true),
            onChange: (checked) => {
                GM_setValue(GM_KEYS.tooltipsEnabled, checked);
                if (window.tooltipManager) {
                    checked ? tooltipManager.enable() : tooltipManager.disable();
                }
            }
        });
        content.appendChild(tooltipsToggle);

        // Layout Version 2 Toggle
        const layoutVersionToggle = createFormGroupToggle({
            title: 'Layout Version 2',
            description: 'Enable new layout with dockable progress card',
            checked: GM_getValue(GM_KEYS.layoutVersion, 'v1') === 'v2',
            onChange: (checked) => {
                const version = checked ? 'v2' : 'v1';
                GM_setValue(GM_KEYS.layoutVersion, version);
                const panel = document.querySelector('#suno-panel');
                if (panel) {
                    panel.classList.toggle('layout_two', checked);
                    // Rebuild UI to apply layout changes - clear and rebuild immediately
                    buildToolPanelUI();
                }
            }
        });
        content.appendChild(layoutVersionToggle);

        // Clear History Section
        const historySection = createActionSection({
            title: 'Clear Download History',
            icon: 'trash',
            buttons: [
                {
                    text: 'Clear Automation',
                    tooltip: 'Clear Track Generation and Download Automation Records History',
                    icon: 'flash',
                    onClick: () => {
                        clearDownloadHistory('automation');
                        toastManager.success('Automation history cleared');
                        modal.close();
                    }
                },
                {
                    text: 'Clear Downloads',
                    tooltip: 'Clear Bulk Downloads Records History',
                    icon: 'cloudDownload',
                    onClick: () => {
                        clearDownloadHistory('bulk');
                        toastManager.success('Bulk history cleared');
                        modal.close();
                    }
                },
                {
                    text: 'Clear All',
                    tooltip: 'Clear All Automation and Bulk Downloads Records History.',
                    icon: 'time',
                    classes: 'btn-danger',
                    full: false,
                    onClick: async () => {
                        const confirmed = await toastManager.confirm('Are you sure you want to clear all download history?');
                        if (confirmed) {
                            clearDownloadHistory('all');
                            toastManager.success('All history cleared');
                            modal.close();
                        }
                    }
                }
            ]
        });
        content.appendChild(historySection);

        modal.addContent(content);
        modal.addButtons([
            {
                text: 'Close',
                icon: 'close',
                classes: ['suno-btn'],
                position: 'right',
                onClick: () => modal.close()
            }
        ]);

        modal.show();
    };

    const startScriptWithPrompts = async () => {
        const textarea = getPromptTextarea();

        if (!textarea) {
            toastManager.warning('Textarea not found. Please wait for the page to load completely.');
            return;
        }

        const promptValue = getPromptValue();
        if (!promptValue) {
            toastManager.warning('Please fill in the textarea before starting the script.');
            return;
        }

        // Show modal for settings
        const settings = await showAutomationModal();
        if (!settings) {
            log('User cancelled automation');
            return;
        }

        CLICK_LIMIT = settings.clicks;
        DOWNLOAD_LIMIT = settings.downloads;

        // Store generation settings and initial text for this session
        window.currentGenerationSettings = {
            clicks: settings.clicks,
            downloads: settings.downloads,
            initialText: promptValue
        };
        window.generationStartTime = Date.now();

        total403s = 0;
        consecutive403s = 0;
        scriptStartTime = Date.now();
        initialTrackIds.clear();
        dataKeyQueue = [];
        // DON'T reset downloadedKeys - keep persistent history to avoid re-downloads
        // downloadedKeys is loaded from GM storage on page load
        currentlyDownloading.clear();
        totalClicks = 0;
        totalDownloads = 0;
        trackMetadata.clear();
        filenameCounts = {};
        processCounter = 0;

        log(`📦 ${downloadedKeys.length} tracks already downloaded (won't re-download)`);


        const panel = getToolPanel();
        panel.addLog('Starting automation...', 'info');
        panel.addLog(`Click limit: ${CLICK_LIMIT || 'unlimited'}`, 'info');
        panel.addLog(`Download limit: ${DOWNLOAD_LIMIT || 'unlimited'}`, 'info');

        updateNotification(CLICK_LIMIT, 0);
        runScript();
    };

    /**************************************************************
     *   RUN SCRIPT
     **************************************************************/
    const runScript = () => {
        // Start the DOM observer to track new clip rows
        const observer = observeNewDivs();
        if (!observer) {
            // This should rarely happen now with the improved getClipsContainer
            log('ERROR: Failed to start DOM observer');
            toastManager.error('Failed to start DOM observer. Try refreshing the page.');
            return;
        }

        log('🚀 Automation started - clicking Create button and monitoring for new tracks');

        // Track if clicks are done
        let clicksFinished = false;

        // Run click loop
        performClicks().then(() => {
            clicksFinished = true;
            log('✓ Click phase completed, continuing to monitor downloads...');
        });

        // Run download check loop
        const downloadInterval = setInterval(async () => {
            await checkAndDownload();

            // Check if we should stop the download loop
            const downloadsComplete = (DOWNLOAD_LIMIT > 0 && totalDownloads >= DOWNLOAD_LIMIT);
            const queueEmpty = dataKeyQueue.length === 0;
            const allTracksReady = Array.from(trackMetadata.values()).every(
                t => t.genStatus === 'ready' || t.downloadStatus === 'completed' || t.downloadStatus === 'failed'
            );

            // Only stop if clicks are done AND (download limit reached OR queue is empty and all tracks ready)
            if (clicksFinished && (downloadsComplete || (queueEmpty && allTracksReady && totalClicks > 0))) {
                clearInterval(downloadInterval);
                log('SUCCESS: Automation completed - all tracks processed');
                updateNotification(0, 0);

                // Disable stop button but don't remove it
                const stopBtn = document.querySelector('#stop-clicks-button');
                if (stopBtn) stopBtn.disabled = true;
            }
        }, 5000);
    };

    /**************************************************************
     *   BULK DOWNLOADER FUNCTIONS (INTEGRATED)
     **************************************************************/
    const WAIT_BETWEEN_DOWNLOADS = 900;
    const POST_LOAD_DELAY = 200;
    const WAIT_GRID_CHANGE_TIMEOUT = 20000;

    // Multiple spinner selectors for different page layouts
    const SPINNER_SELECTORS = [
        '.flex.relative.max-w-\\[400px\\] span.absolute.right-\\[7px\\].top-\\[10px\\].opacity-70',
        '[class*="loading"]',
        '[class*="spinner"]',
        'svg[class*="animate-spin"]',
        '[data-testid="loading"]',
        '[aria-busy="true"]',
    ];

    const isPageLoading = () => {
        // Check multiple loading indicators
        for (const selector of SPINNER_SELECTORS) {
            try {
                const spinner = document.querySelector(selector);
                if (spinner) {
                    // For the specific spinner, check if it has content
                    if (selector.includes('opacity-70')) {
                        return spinner.innerHTML.trim() !== "";
                    }
                    // For aria-busy, check the attribute value
                    if (selector === '[aria-busy="true"]') {
                        return true;
                    }
                    // For animated elements, they indicate loading
                    if (selector.includes('animate') || selector.includes('spinner')) {
                        return true;
                    }
                    // For generic loading class, element presence indicates loading
                    if (spinner.offsetParent !== null) { // Check if visible
                        return true;
                    }
                }
            } catch (e) {
                // Skip invalid selectors
            }
        }
        return false;
    };
    const waitForPageLoadingStart = async (timeout = 5000) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            if (isPageLoading()) return true;
            await sleep(60);
        }
        return false;
    };
    const waitForPageLoaded = async (timeout = 20000, postDelay = 200) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            if (!isPageLoading()) {
                await sleep(postDelay);
                if (!isPageLoading()) return true;
            }
            await sleep(80);
        }
        return false;
    };

    const getSongsFromPage = (globalCounts, seenUrls) => {
        let results = [];

        // Method 1: Try React props approach (works on Library views like /me)
        try {
            // Try multiple selectors for the grid element
            const gridSelectors = [
                '[role="grid"]',
                '[role="table"]',
                '[role="rowgroup"]',
                '.css-fpqk02', // Library view container class
                '[class*="ea40gze"]', // Library view class pattern
                '[data-testid="clip-list"]', // Clip list container
            ];

            let grid = null;
            for (const selector of gridSelectors) {
                grid = document.querySelector(selector);
                if (grid) break;
            }

            if (grid) {
                const reactPropsKey = Object.keys(grid).find(x => x.startsWith('__reactProps'));
                if (reactPropsKey) {
                    // Try multiple paths to find the collection data
                    let valuesArr = grid[reactPropsKey]?.children?.[0]?.props?.values?.[0]?.[1]?.collection;

                    // Alternative paths for different React structures
                    if (!valuesArr) {
                        valuesArr = grid[reactPropsKey]?.children?.props?.values?.[0]?.[1]?.collection;
                    }
                    if (!valuesArr) {
                        valuesArr = grid[reactPropsKey]?.children?.[0]?.props?.children?.props?.values?.[0]?.[1]?.collection;
                    }

                    if (valuesArr && Array.isArray(valuesArr)) {
                        for (const x of valuesArr) {
                            if (x.value?.audio_url || x.value?.video_url) {
                                const v = x.value;
                                let baseTitle = (v.title?.trim() || v.id).replace(/[\/\\:*?"<>|]/g, "_");
                                if (!globalCounts[baseTitle]) globalCounts[baseTitle] = 1;
                                else globalCounts[baseTitle]++;
                                let uniqueTitle = baseTitle;
                                if (globalCounts[baseTitle] > 1) uniqueTitle += "_" + globalCounts[baseTitle];

                                // Build full metadata object
                                const trackMeta = {
                                    id: v.id,
                                    title: uniqueTitle,
                                    rawTitle: v.title?.trim() || v.id,
                                    // Duration - try multiple possible fields
                                    duration: v.duration || v.clip_duration || v.audio_duration || null,
                                    durationSeconds: v.duration_seconds || v.clip_duration_seconds || null,
                                    // Prompt and style info
                                    prompt: v.gpt_description_prompt || v.prompt || v.metadata?.prompt || '',
                                    tags: v.tags || v.style || v.metadata?.tags || '',
                                    // Dates
                                    createdAt: v.created_at || v.created || null,
                                    updatedAt: v.updated_at || v.updated || null,
                                    // Suno version
                                    modelVersion: v.model_version || v.model_name || v.major_model_version || '',
                                    // Workspace and playlist
                                    workspaceId: v.workspace_id || v.user_id || null,
                                    workspaceName: v.workspace_name || v.display_name || '',
                                    playlistId: v.playlist_id || null,
                                    playlistName: v.playlist_name || '',
                                    // URLs
                                    thumbnailUrl: v.image_url || v.image_large_url || (v.id ? `https://cdn2.suno.ai/image_${v.id}.jpeg` : null),
                                    audioUrl: v.audio_url || null,
                                    videoUrl: v.video_url || null,
                                    // Additional metadata
                                    isPublic: v.is_public || false,
                                    playCount: v.play_count || 0,
                                    likeCount: v.upvote_count || v.like_count || 0,
                                    // Queue status (will be set later)
                                    queueStatus: 'pending',
                                    fetchedAt: Date.now()
                                };

                                if (v.audio_url && !seenUrls.has(v.audio_url)) {
                                    results.push({
                                        ...trackMeta,
                                        url: v.audio_url,
                                        filename: uniqueTitle + ".mp3",
                                        type: 'audio'
                                    });
                                    seenUrls.add(v.audio_url);
                                }
                                if (v.video_url && !seenUrls.has(v.video_url)) {
                                    results.push({
                                        ...trackMeta,
                                        url: v.video_url,
                                        filename: uniqueTitle + ".mp4",
                                        type: 'video'
                                    });
                                    seenUrls.add(v.video_url);
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            log('React props method failed:', e.message);
        }

        // Method 2: Extract from visible clip rows (works on /create page)
        if (results.length === 0) {
            try {
                const clipRows = document.querySelectorAll('[data-testid="clip-row"]');
                for (const row of clipRows) {
                    // Extract song ID from the link href
                    const songLink = row.querySelector('a[href^="/song/"]');
                    if (!songLink) continue;

                    const songId = songLink.getAttribute('href').replace('/song/', '');
                    if (!songId) continue;

                    // Construct the audio URL
                    const audioUrl = `https://cdn1.suno.ai/${songId}.mp3`;
                    if (seenUrls.has(audioUrl)) continue;

                    // Get title from the link text or image alt
                    let title = songLink.textContent?.trim();
                    if (!title) {
                        const img = row.querySelector('img[alt]');
                        title = img?.getAttribute('alt')?.replace(' artwork', '').trim();
                    }
                    if (!title) title = songId;

                    // Try to extract duration from DOM
                    const durationEl = row.querySelector('.clip-image-container .css-421ta7') ||
                        row.querySelector('[class*="duration"]');
                    const duration = durationEl?.textContent?.trim() || null;

                    // Try to extract style/tags from DOM
                    const styleEl = row.querySelector('[class*="tag"]') || row.querySelector('[class*="style"]');
                    const tags = styleEl?.textContent?.trim() || '';

                    // Clean title for filename
                    let baseTitle = title.replace(/[\/\\:*?"<>|]/g, "_");
                    if (!globalCounts[baseTitle]) globalCounts[baseTitle] = 1;
                    else globalCounts[baseTitle]++;
                    let uniqueTitle = baseTitle;
                    if (globalCounts[baseTitle] > 1) uniqueTitle += "_" + globalCounts[baseTitle];

                    results.push({
                        id: songId,
                        title: uniqueTitle,
                        rawTitle: title,
                        filename: uniqueTitle + ".mp3",
                        url: audioUrl,
                        audioUrl: audioUrl,
                        duration: duration,
                        tags: tags,
                        thumbnailUrl: `https://cdn2.suno.ai/image_${songId}.jpeg`,
                        type: 'audio',
                        queueStatus: 'pending',
                        fetchedAt: Date.now()
                    });
                    seenUrls.add(audioUrl);
                }
            } catch (e) {
                log('Clip rows method failed:', e.message);
            }
        }

        // Method 3: Extract from Library infinite scroll view (clip-browser-list-scroller)
        if (results.length === 0) {
            try {
                // Look for the infinite scroll container
                const scroller = document.querySelector('.clip-browser-list-scroller') ||
                    document.querySelector('[class*="clip-browser"]');
                const rowgroup = scroller?.querySelector('[role="rowgroup"]') || document.querySelector('[role="rowgroup"]');

                // Find clip rows - they are div.relative containing div.clip-row
                const clipRows = rowgroup?.querySelectorAll('div.relative div.clip-row') ||
                    document.querySelectorAll('div.clip-row') ||
                    document.querySelectorAll('[class*="clip-row"]');

                for (const row of clipRows) {
                    // Look for song link
                    const songLink = row.querySelector('a[href^="/song/"]') ||
                        row.closest('div.relative')?.querySelector('a[href^="/song/"]');
                    if (!songLink) continue;

                    const href = songLink.getAttribute('href');
                    const songIdMatch = href.match(/\/song\/([a-f0-9-]+)/i);
                    if (!songIdMatch) continue;

                    const songId = songIdMatch[1];
                    const audioUrl = `https://cdn1.suno.ai/${songId}.mp3`;
                    if (seenUrls.has(audioUrl)) continue;

                    // Get title from various sources
                    let title = songLink.textContent?.trim();
                    if (!title || title.length < 2) {
                        // Check clip-image-container for alt text
                        const imgContainer = row.querySelector('.clip-image-container') ||
                            row.closest('div.relative')?.querySelector('.clip-image-container');
                        const img = imgContainer?.querySelector('img[alt]') || row.querySelector('img[alt]');
                        title = img?.getAttribute('alt')?.replace(' artwork', '').replace(' cover', '').trim();
                    }
                    if (!title || title.length < 2) {
                        // Try image URL to extract song ID-based title
                        const img = row.querySelector('img[src*="cdn"]');
                        if (img?.src) {
                            const imgIdMatch = img.src.match(/([a-f0-9-]{36})/i);
                            if (imgIdMatch) title = imgIdMatch[1];
                        }
                    }
                    if (!title) title = songId;

                    // Try to extract duration from DOM
                    const durationEl = row.querySelector('.clip-image-container .css-421ta7') ||
                        row.querySelector('[class*="duration"]') ||
                        row.closest('div.relative')?.querySelector('[class*="duration"]');
                    const duration = durationEl?.textContent?.trim() || null;

                    // Clean title for filename
                    let baseTitle = title.replace(/[\/\\:*?"<>|]/g, "_");
                    if (!globalCounts[baseTitle]) globalCounts[baseTitle] = 1;
                    else globalCounts[baseTitle]++;
                    let uniqueTitle = baseTitle;
                    if (globalCounts[baseTitle] > 1) uniqueTitle += "_" + globalCounts[baseTitle];

                    results.push({
                        id: songId,
                        title: uniqueTitle,
                        rawTitle: title,
                        filename: uniqueTitle + ".mp3",
                        url: audioUrl,
                        audioUrl: audioUrl,
                        duration: duration,
                        thumbnailUrl: `https://cdn2.suno.ai/image_${songId}.jpeg`,
                        type: 'audio',
                        queueStatus: 'pending',
                        fetchedAt: Date.now()
                    });
                    seenUrls.add(audioUrl);
                }
            } catch (e) {
                log('Library infinite scroll method failed:', e.message);
            }
        }

        // Method 4: Extract from Library view rows (alternative DOM structure with role="row")
        if (results.length === 0) {
            try {
                const rowSelectors = [
                    '[role="row"]',
                    '[class*="e1fow7ua"]', // Library row class pattern
                    'tr'
                ];

                for (const rowSelector of rowSelectors) {
                    const rows = document.querySelectorAll(rowSelector);
                    for (const row of rows) {
                        const songLink = row.querySelector('a[href^="/song/"]') ||
                            row.querySelector('a[href*="/song/"]');
                        if (!songLink) continue;

                        const href = songLink.getAttribute('href');
                        const songIdMatch = href.match(/\/song\/([a-f0-9-]+)/i);
                        if (!songIdMatch) continue;

                        const songId = songIdMatch[1];
                        const audioUrl = `https://cdn1.suno.ai/${songId}.mp3`;
                        if (seenUrls.has(audioUrl)) continue;

                        let title = songLink.textContent?.trim();
                        if (!title || title.length < 2) {
                            const img = row.querySelector('img[alt]');
                            title = img?.getAttribute('alt')?.replace(' artwork', '').replace(' cover', '').trim();
                        }
                        if (!title) title = songId;

                        // Try to extract duration
                        const durationEl = row.querySelector('[class*="duration"]');
                        const duration = durationEl?.textContent?.trim() || null;

                        let baseTitle = title.replace(/[\/\\:*?"<>|]/g, "_");
                        if (!globalCounts[baseTitle]) globalCounts[baseTitle] = 1;
                        else globalCounts[baseTitle]++;
                        let uniqueTitle = baseTitle;
                        if (globalCounts[baseTitle] > 1) uniqueTitle += "_" + globalCounts[baseTitle];

                        results.push({
                            id: songId,
                            title: uniqueTitle,
                            rawTitle: title,
                            filename: uniqueTitle + ".mp3",
                            url: audioUrl,
                            audioUrl: audioUrl,
                            duration: duration,
                            thumbnailUrl: `https://cdn2.suno.ai/image_${songId}.jpeg`,
                            type: 'audio',
                            queueStatus: 'pending',
                            fetchedAt: Date.now()
                        });
                        seenUrls.add(audioUrl);
                    }

                    if (results.length > 0) break;
                }
            } catch (e) {
                log('Library rows method failed:', e.message);
            }
        }

        if (results.length === 0) {
            log('No songs found on page. Try scrolling or checking if the page has loaded.');
        }

        return results;
    };

    // Check if we're on a single-page view (no more pages to fetch)
    const isSinglePageView = () => {
        // Check for "Showing one page of X songs" text
        const infoContainer = document.querySelector('.css-fu18b6.ea40gze4') ||
            document.querySelector('[class*="ea40gze4"]') ||
            document.querySelector('[class*="ea40gze5"]');
        if (infoContainer) {
            const text = infoContainer.textContent || '';
            if (text.includes('Showing one page') || text.includes('one page of')) {
                return true;
            }
        }
        return false;
    };

    // Check if we're on an infinite scroll view
    // Detect scroll completion using requestAnimationFrame
    // CRITICAL: Checks for paused/stopped state to prevent runaway processes
    const detectScrollCompletion = (scroller, timeout = 5000) => {
        return new Promise((resolve) => {
            let lastHeight = scroller ? scroller.scrollHeight : document.body.scrollHeight;
            let stableCount = 0;
            const STABLE_THRESHOLD = 3; // Require 3 consecutive stable measurements
            const startTime = Date.now();

            const check = () => {
                // CRITICAL: Stop immediately if paused or stopped
                if (bulkDownloaderState.isPaused || bulkDownloaderState.isStopped || !bulkDownloaderState.isFetching) {
                    resolve(false); // Abort
                    return;
                }

                if (Date.now() - startTime > timeout) {
                    resolve(false); // Timeout
                    return;
                }

                const currentHeight = scroller ? scroller.scrollHeight : document.body.scrollHeight;

                if (currentHeight === lastHeight) {
                    stableCount++;
                    if (stableCount >= STABLE_THRESHOLD) {
                        resolve(true); // Scroll height stable, likely done loading
                        return;
                    }
                } else {
                    stableCount = 0; // Reset if height changed
                    lastHeight = currentHeight;
                }

                requestAnimationFrame(check);
            };

            requestAnimationFrame(check);
        });
    };

    const isInfiniteScrollView = () => {
        return !!document.querySelector('.clip-browser-list-scroller');
    };

    const getPaginationContainer = () => {
        // Try multiple selectors for pagination container
        // Library view (/me) uses css-fpqk02.ea40gze1
        // /create page may use eck1ibl class pattern
        // Also try the gap-[5px] selector for older views
        const selectors = [
            'div.css-fpqk02.ea40gze1', // Library view (new structure)
            'div.css-cb8kv4.eck1ibl0', // /create page structure
            '[class*="eck1ibl"]', // Class pattern from /create page
            'div.flex-row.flex.items-center.gap-\\[5px\\]', // Legacy structure
        ];

        // First try specific selectors
        for (const selector of selectors) {
            try {
                const containers = document.querySelectorAll(selector);
                for (const c of containers) {
                    // Check if this container has pagination buttons
                    const hasPrevBtn = c.querySelector('button[aria-label="Previous page"]') ||
                        c.querySelector('button[aria-label="Previous Page"]') ||
                        c.querySelector('button[aria-label="previous page"]');
                    const hasNextBtn = c.querySelector('button[aria-label="Next page"]') ||
                        c.querySelector('button[aria-label="Next Page"]') ||
                        c.querySelector('button[aria-label="next page"]') ||
                        c.querySelector('button[aria-label=""]');
                    if (hasPrevBtn || hasNextBtn) {
                        return c;
                    }
                }
            } catch (e) {
                // Skip invalid selectors
            }
        }

        // Fallback: find any container with both prev and next buttons using :has()
        try {
            const fallback = document.querySelector(':has(button[aria-label="Previous page"]):has(button[aria-label="Next page"])') ||
                document.querySelector(':has(button[aria-label="Previous Page"]):has(button[aria-label="Next Page"])');
            if (fallback) return fallback;
        } catch (e) {
            // :has() not supported or selector failed
        }

        return null;
    };

    const getNextButton = () => {
        const container = getPaginationContainer();
        if (!container) return null;
        // Try different aria-labels for next button (case variations)
        return container.querySelector('button[aria-label="Next page"]') ||
            container.querySelector('button[aria-label="Next Page"]') ||
            container.querySelector('button[aria-label="next page"]') ||
            container.querySelector('button[aria-label=""]');
    };
    const isNextDisabled = (btn) => {
        return btn && btn.hasAttribute('disabled');
    };


    /**************************************************************
     *   BULK DOWNLOADER INTEGRATED PANEL
     **************************************************************/
    const createBulkDownloaderContent = () => {
        // Create bulk content as a sibling panel section (between controls and log wrapper)
        const container = createElement('div', { class: 'suno-panel-controls suno-bulk-content' });

        const layoutVersion = GM_getValue(GM_KEYS.layoutVersion, 'v1');
        const isLayoutV2 = layoutVersion === 'v2';

        if (isLayoutV2) {
            container.id = 'suno-bulk-controls';
        }

        // Title row with close button - this IS the progress row in Layout V2
        const titleRow = createElement('div', {
            class: 'suno-button-row title suno-bulk-progress',
            id: 'suno-bulk-progress'
        });

        // Icon as direct child
        titleRow.appendChild(createIcon('cloudDownload'));

        // Progress label span as direct child
        const progressLabel = createElement('span', { class: 'progress-label' });
        progressLabel.textContent = ' Bulk Downloader Tools';
        titleRow.appendChild(progressLabel);

        // Close button as direct child
        const closeBtn = createElement('button', { class: 'suno-panel-btn', title: 'Hide Progress' });
        closeBtn.appendChild(createIcon('xmark', '12px'));
        closeBtn.addEventListener('click', () => {
            container.classList.remove('open');
        });
        titleRow.appendChild(closeBtn);

        container.appendChild(titleRow);

        const copyBtn = createElement('button', { class: 'suno-btn' });
        copyBtn.appendChild(createIcon('copy'));
        copyBtn.appendChild(createElement('span', { text: 'Copy' }));
        copyBtn.addEventListener('click', async () => {
            const songs = getSongsFromPage({}, new Set());
            if (!songs.length) {
                toastManager.warning('No songs found on current page!');
                return;
            }
            const str = songs.map(s => `${s.title}|${s.url}`).join('\n');
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(str);
                toastManager.success(`Copied ${songs.length} songs to clipboard!`);
            } else {
                await navigator.clipboard.writeText(str);
                toastManager.success(`Copied ${songs.length} songs to clipboard!`);
            }
        });

        const saveBtn = createElement('button', { class: 'suno-btn' });
        saveBtn.appendChild(createIcon('fileExport'));
        saveBtn.appendChild(createElement('span', { text: 'Save .txt' }));
        saveBtn.addEventListener('click', () => {
            // Export from fetched table if available, otherwise from visible page
            let songs = [];
            if (fetchState.allSongs && fetchState.allSongs.size > 0) {
                songs = Array.from(fetchState.allSongs.values());
                log(`Exporting ${songs.length} songs from fetched results`);
            } else {
                songs = getSongsFromPage({}, new Set());
                log(`Exporting ${songs.length} songs from visible page`);
            }

            if (!songs.length) {
                toastManager.warning('No songs to export! Use "Fetch All" first.');
                return;
            }
            const blob = new Blob([songs.map(s => `${s.title}|${s.url}`).join('\n')], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `suno_songs_${new Date().toISOString().slice(0, 10)}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            toastManager.success(`Exported ${songs.length} songs to file!`);
        });

        const fetchAllBtn = createElement('button', { id: 'suno-bulk-all', class: 'suno-btn btn-info' });
        fetchAllBtn.appendChild(createIcon('layerGroup'));
        fetchAllBtn.appendChild(createElement('span', { text: 'Fetch All' }));
        fetchAllBtn.addEventListener('click', async () => {
            // Close modal automatically when fetch starts (user preference: auto-close)
            const queueOverlay = document.querySelector('.suno-modal-overlay[data-modal="queue"]');
            if (queueOverlay && queueOverlay.classList.contains('visible')) {
                hideQueueModal();
            }

            // CUMULATIVE MODE: Don't reset if we already have songs (continue from where we left off)
            const isContinuing = bulkDownloaderState.fetch.allSongs && bulkDownloaderState.fetch.allSongs.size > 0;

            // Update unified state
            bulkDownloaderState.isFetching = true;
            bulkDownloaderState.isPaused = false;
            bulkDownloaderState.isStopped = false;
            bulkDownloaderState.activeProcess = 'fetch';
            bulkDownloaderState.fetch.source = getCurrentFetchSource();
            bulkDownloaderState.fetch.scrollAttempts = 0;
            bulkDownloaderState.fetch.consecutiveEmptyPages = 0;

            queueMeta.fetchSource = window.location.href;
            saveFetchQueue();

            // Create/update progress card
            createProgressCard('bulk');
            updateProgressCard({
                downloads: 0,
                downloadLimit: 0,
                pending: fetchQueue.length,
                tracks: bulkDownloaderState.fetch.allSongs.size || 0,
                isPaused: false,
                isStopped: false,
                source: bulkDownloaderState.fetch.source
            }, 'bulk');

            BulkLogger.info('Bulk fetch started...');

            // Only reset if starting fresh (no existing songs)
            if (!isContinuing) {
                bulkDownloaderState.fetch.allSongs = new Map();
                bulkDownloaderState.fetch.processedPages = 0;
                bulkDownloaderState.fetch.titleCounts = {};
                // Keep seenUrls from GM storage but also add any in-memory ones
                loadBulkDownloaded(); // Reload from storage to ensure we have latest
                BulkLogger.info('Starting fresh fetch...');
            } else {
                BulkLogger.info(`Continuing fetch with ${bulkDownloaderState.fetch.allSongs.size} existing songs...`);
            }

            const pauseBtn = document.querySelector('#suno-bulk-pause');
            const stopBtn = document.querySelector('#suno-bulk-stop');
            const downloadBtn = document.querySelector('#suno-bulk-download');
            const progress = document.querySelector('#suno-bulk-progress');

            if (pauseBtn) pauseBtn.disabled = false;
            if (stopBtn) stopBtn.disabled = false;
            if (downloadBtn) downloadBtn.disabled = true;
            fetchAllBtn.disabled = true;
            if (progress) {
                const progressLabel = progress.querySelector('.progress-label');
                if (progressLabel && isLayoutV2) {
                    const currentTracks = isContinuing ? (fetchState.allSongs ? fetchState.allSongs.size : 0) : 0;
                    progressLabel.innerHTML = ` Running, Fetching Tracks:<strong>${currentTracks}</strong>`;
                } else {
                    progress.textContent = isContinuing ?
                        `Continuing fetch (${fetchState.allSongs.size} songs)...` :
                        'Fetching songs...';
                }
            }

            // Check if single page view or infinite scroll
            const singlePage = isSinglePageView();
            const infiniteScroll = isInfiniteScrollView();
            const container = getPaginationContainer();

            if (singlePage) {
                log('📄 Single page view detected - fetching current page only');
                if (progress) {
                    const progressLabel = progress.querySelector('.progress-label');
                    if (progressLabel && isLayoutV2) {
                        progressLabel.innerHTML = ' Running, Fetching Tracks:<strong>0</strong>';
                    } else {
                        progress.textContent = 'Single page view - fetching...';
                    }
                }
            } else if (infiniteScroll) {
                log('📜 Infinite scroll view detected');
                // CRITICAL: Only show this message during active fetching, not when paused/completed
                if (progress && bulkDownloaderState.isFetching && !bulkDownloaderState.isPaused) {
                    const progressLabel = progress.querySelector('.progress-label');
                    if (progressLabel && isLayoutV2) {
                        const currentTracks = bulkDownloaderState.fetch.allSongs ? bulkDownloaderState.fetch.allSongs.size : 0;
                        progressLabel.innerHTML = ` Running, Fetching Tracks:<strong>${currentTracks}</strong>`;
                    } else {
                        progress.textContent = 'Infinite scroll view - scrolling to load all...';
                    }
                }
            } else if (!container) {
                log('⚠️ No pagination found - fetching current page only');
                if (progress) {
                    const progressLabel = progress.querySelector('.progress-label');
                    if (progressLabel && isLayoutV2) {
                        progressLabel.innerHTML = ' Running, Fetching Tracks:<strong>0</strong>';
                    } else {
                        progress.textContent = 'No pagination found - fetching current page...';
                    }
                }
            }

            let input = container ? container.querySelector('input[type=number]') : null;
            if (input && !singlePage && !infiniteScroll) {
                input.value = 1;
                input.dispatchEvent(new Event('change', { bubbles: true }));
                await waitForPageLoaded();
            }

            let page = 1;
            let consecutiveEmptyPages = 0;
            const MAX_EMPTY_PAGES = 2; // Stop after 2 consecutive pages with no new songs

            // For infinite scroll, we'll scroll and fetch with improved detection
            if (infiniteScroll) {
                // Get scroll container - try multiple selectors, always accessible
                let scroller = document.querySelector('.clip-browser-list-scroller');
                if (!scroller) {
                    // Fallback to window scroll
                    scroller = null;
                }

                const MAX_SCROLL_ATTEMPTS = 100; // Hard stop condition
                const MAX_NO_CONTENT_RETRIES = 5;
                const SCROLL_WAIT_BASE = 800;
                const MAX_TIME_LIMIT = 30 * 60 * 1000; // 30 minutes safety limit
                const startTime = Date.now();

                while (bulkDownloaderState.isFetching && !bulkDownloaderState.isStopped &&
                    bulkDownloaderState.fetch.scrollAttempts < MAX_SCROLL_ATTEMPTS &&
                    (Date.now() - startTime) < MAX_TIME_LIMIT) {

                    // Check pause - CRITICAL: Update UI once, then wait without updates
                    if (bulkDownloaderState.isPaused) {
                        BulkLogger.info('Fetch paused');
                        // Update once to show paused state
                        updateProgressCard({
                            downloads: 0,
                            downloadLimit: 0,
                            pending: fetchQueue.length,
                            tracks: bulkDownloaderState.fetch.allSongs.size,
                            isPaused: true,
                            isStopped: false,
                            source: bulkDownloaderState.fetch.source
                        }, 'bulk');

                        // Wait in pause loop WITHOUT updating UI (prevents constant DOM mutations)
                        while (bulkDownloaderState.isPaused && bulkDownloaderState.isFetching && !bulkDownloaderState.isStopped) {
                            await responsiveSleep(250, () => bulkDownloaderState.isFetching && !bulkDownloaderState.isStopped);
                        }
                        if (bulkDownloaderState.isStopped) break;
                    }

                    const prevSize = bulkDownloaderState.fetch.allSongs.size;
                    const songs = getSongsFromPage(bulkDownloaderState.fetch.titleCounts, bulkDownloaderState.fetch.seenUrls);

                    if (songs.length > 0) {
                        BulkLogger.info(`Found ${songs.length} new songs (scroll attempt ${bulkDownloaderState.fetch.scrollAttempts + 1})`);
                        for (const s of songs) {
                            bulkDownloaderState.fetch.allSongs.set(`${s.title}|${s.url}`, s);
                        }
                        bulkDownloaderState.fetch.consecutiveEmptyPages = 0;

                        // Sync to queue
                        syncFetchStateToQueue();
                        updateBulkTable();

                        updateProgressCard({
                            downloads: 0,
                            downloadLimit: 0,
                            pending: fetchQueue.length,
                            tracks: bulkDownloaderState.fetch.allSongs.size,
                            isPaused: false,
                            isStopped: false,
                            source: bulkDownloaderState.fetch.source
                        }, 'bulk');
                    } else {
                        bulkDownloaderState.fetch.consecutiveEmptyPages++;
                        BulkLogger.debug(`No new songs found (${bulkDownloaderState.fetch.consecutiveEmptyPages}/${MAX_EMPTY_PAGES})`);
                    }

                    // Check hard stop conditions
                    if (bulkDownloaderState.fetch.consecutiveEmptyPages >= MAX_EMPTY_PAGES) {
                        BulkLogger.info('End of list reached (no new songs)');
                        break;
                    }

                    // Scroll down
                    if (scroller) {
                        scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
                    } else {
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }

                    // Use RAF-based scroll detection
                    await detectScrollCompletion(scroller, SCROLL_WAIT_BASE);

                    // Additional wait for content to load
                    await responsiveSleep(SCROLL_WAIT_BASE, () => bulkDownloaderState.isFetching && !bulkDownloaderState.isStopped);

                    bulkDownloaderState.fetch.scrollAttempts++;
                }

                // Hard stop if max attempts reached
                if (bulkDownloaderState.fetch.scrollAttempts >= MAX_SCROLL_ATTEMPTS) {
                    BulkLogger.warn(`Max scroll attempts reached (${MAX_SCROLL_ATTEMPTS})`);
                }
                if ((Date.now() - startTime) >= MAX_TIME_LIMIT) {
                    BulkLogger.warn('Max time limit reached (30 minutes)');
                }
            } else {
                // Pagination-based fetching
                while (bulkDownloaderState.isFetching && !bulkDownloaderState.isStopped) {
                    if (bulkDownloaderState.isPaused) {
                        BulkLogger.info(`Fetch paused at page ${page}`);
                        // Update once to show paused state
                        updateProgressCard({
                            downloads: 0,
                            downloadLimit: 0,
                            pending: fetchQueue.length,
                            tracks: bulkDownloaderState.fetch.allSongs.size,
                            isPaused: true,
                            isStopped: false,
                            source: bulkDownloaderState.fetch.source
                        }, 'bulk');

                        // Wait in pause loop WITHOUT updating UI (prevents constant DOM mutations)
                        while (bulkDownloaderState.isPaused && bulkDownloaderState.isFetching && !bulkDownloaderState.isStopped) {
                            await responsiveSleep(250, () => bulkDownloaderState.isFetching && !bulkDownloaderState.isStopped);
                        }
                        if (bulkDownloaderState.isStopped) break;
                    }

                    await waitForPageLoaded();
                    BulkLogger.debug(`Grid loaded on page ${page}`);

                    const prevSize = bulkDownloaderState.fetch.allSongs.size;
                    const songs = getSongsFromPage(bulkDownloaderState.fetch.titleCounts, bulkDownloaderState.fetch.seenUrls);

                    if (songs.length === 0) {
                        bulkDownloaderState.fetch.consecutiveEmptyPages++;
                        BulkLogger.debug(`No songs found on page ${page} (${bulkDownloaderState.fetch.consecutiveEmptyPages}/${MAX_EMPTY_PAGES})`);
                        if (page === 1) {
                            toastManager.warning('No songs found! The page structure may have changed.');
                        }
                    } else {
                        BulkLogger.info(`Found ${songs.length} items on page ${page}`);
                        bulkDownloaderState.fetch.consecutiveEmptyPages = 0;
                    }

                    for (const s of songs) {
                        bulkDownloaderState.fetch.allSongs.set(`${s.title}|${s.url}`, s);
                    }

                    // Check if any new songs were actually added (not duplicates)
                    const newSongsAdded = bulkDownloaderState.fetch.allSongs.size - prevSize;
                    if (newSongsAdded === 0 && songs.length === 0) {
                        bulkDownloaderState.fetch.consecutiveEmptyPages++;
                    }

                    bulkDownloaderState.fetch.processedPages = page;
                    syncFetchStateToQueue();
                    updateBulkTable();

                    updateProgressCard({
                        downloads: 0,
                        downloadLimit: 0,
                        pending: fetchQueue.length,
                        tracks: bulkDownloaderState.fetch.allSongs.size,
                        isPaused: false,
                        isStopped: false,
                        source: bulkDownloaderState.fetch.source
                    }, 'bulk');

                    // Stop conditions:
                    // 1. Single page view
                    // 2. Too many consecutive empty pages
                    // 3. No next button or disabled
                    if (singlePage) {
                        BulkLogger.info('Single page - done');
                        break;
                    }

                    if (bulkDownloaderState.fetch.consecutiveEmptyPages >= MAX_EMPTY_PAGES) {
                        BulkLogger.info(`End of list reached (${bulkDownloaderState.fetch.consecutiveEmptyPages} empty pages)`);
                        break;
                    }

                    const nextBtn = getNextButton();
                    if (!nextBtn || isNextDisabled(nextBtn)) {
                        BulkLogger.info("No next page or next is disabled.");
                        break;
                    }

                    nextBtn.click();
                    BulkLogger.debug("Clicked next page");
                    await waitForPageLoadingStart();
                    await waitForPageLoaded();
                    page++;

                    // Safety limit to prevent infinite loops
                    if (page > 100) {
                        BulkLogger.warn('Safety limit reached (100 pages)');
                        break;
                    }
                }
            }

            window.__sunoSongsBulkList = Array.from(bulkDownloaderState.fetch.allSongs.values());

            // Final sync to queue
            syncFetchStateToQueue();

            // Update unified state
            bulkDownloaderState.isFetching = false;
            bulkDownloaderState.isPaused = false;
            bulkDownloaderState.activeProcess = null;
            saveFetchQueue();

            let completionMsg = '';
            if (!bulkDownloaderState.isStopped) {
                completionMsg = `Fetch complete! ${window.__sunoSongsBulkList.length} track(s) collected.`;
                BulkLogger.info(completionMsg);
                toastManager.success(`Fetched ${window.__sunoSongsBulkList.length} songs!`);
            } else {
                completionMsg = `Fetch stopped. ${bulkDownloaderState.fetch.allSongs.size} track(s) collected.`;
                BulkLogger.warn(completionMsg);
            }

            // Update UI buttons
            if (pauseBtn) pauseBtn.disabled = true;
            if (stopBtn) stopBtn.disabled = true;
            if (downloadBtn) downloadBtn.disabled = false;
            fetchAllBtn.disabled = false;

            // Update progress card
            updateProgressCard({
                downloads: 0,
                downloadLimit: 0,
                pending: fetchQueue.length,
                tracks: bulkDownloaderState.fetch.allSongs.size || fetchQueue.length || 0,
                isPaused: false,
                isStopped: true,
                source: bulkDownloaderState.fetch.source
            }, 'bulk');

            setPerfMode(false);
        });

        const pauseBtn = createElement('button', { id: 'suno-bulk-pause', class: 'suno-btn btn-warning' });
        pauseBtn.appendChild(createIcon('pause'));
        pauseBtn.appendChild(createElement('span', { text: 'Pause' }));
        pauseBtn.disabled = true;
        pauseBtn.addEventListener('click', () => {
            bulkDownloaderState.isPaused = !bulkDownloaderState.isPaused;
            saveFetchQueue();

            const span = pauseBtn.querySelector('span');
            if (bulkDownloaderState.isPaused) {
                updateIcon(pauseBtn, 'play');
                span.textContent = 'Resume';
                BulkLogger.info('Fetch paused');
            } else {
                updateIcon(pauseBtn, 'pause');
                span.textContent = 'Pause';
                BulkLogger.info('Fetch resumed');
            }

            // Update progress text immediately
            const progress = document.querySelector('#suno-bulk-progress');
            if (progress) {
                const currentLayoutVersion = GM_getValue(GM_KEYS.layoutVersion, 'v1');
                const isCurrentLayoutV2 = currentLayoutVersion === 'v2';
                const progressLabel = progress.querySelector('.progress-label');
                if (progressLabel && isCurrentLayoutV2) {
                    if (bulkDownloaderState.isPaused) {
                        progressLabel.innerHTML = ` Paused. ${bulkDownloaderState.fetch.allSongs.size} songs collected. Click Resume to continue.`;
                    } else {
                        progressLabel.innerHTML = ` Running, Fetching Tracks:<strong>${bulkDownloaderState.fetch.allSongs.size}</strong>`;
                    }
                }
            }

            // Update progress card
            updateProgressCard({
                downloads: 0,
                downloadLimit: 0,
                pending: fetchQueue.length,
                tracks: bulkDownloaderState.fetch.allSongs.size,
                isPaused: bulkDownloaderState.isPaused,
                isStopped: false,
                source: bulkDownloaderState.fetch.source
            }, 'bulk');
        });

        const stopBtn = createElement('button', { id: 'suno-bulk-stop', class: 'suno-btn btn-danger' });
        stopBtn.appendChild(createIcon('stop'));
        stopBtn.appendChild(createElement('span', { text: 'Stop' }));
        stopBtn.disabled = true;
        stopBtn.addEventListener('click', () => {
            bulkDownloaderState.isStopped = true;
            bulkDownloaderState.isFetching = false;
            bulkDownloaderState.isPaused = false;
            bulkDownloaderState.activeProcess = null;
            saveFetchQueue();

            BulkLogger.warn('Fetch stopped by user');

            // Update UI
            updateBulkTable();
            const progress = document.querySelector('#suno-bulk-progress');
            if (progress) {
                const currentLayoutVersion = GM_getValue(GM_KEYS.layoutVersion, 'v1');
                const isCurrentLayoutV2 = currentLayoutVersion === 'v2';
                const progressLabel = progress.querySelector('.progress-label');
                if (progressLabel && isCurrentLayoutV2) {
                    progressLabel.textContent = ` Stopped. ${bulkDownloaderState.fetch.allSongs.size} songs collected.`;
                } else {
                    progress.textContent = `Stopped. ${bulkDownloaderState.fetch.allSongs.size} songs collected.`;
                }
            }
            const fetchAllBtn = document.querySelector('#suno-bulk-all');
            if (fetchAllBtn) fetchAllBtn.disabled = false;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;

            // Update progress card
            updateProgressCard({
                downloads: 0,
                downloadLimit: 0,
                pending: fetchQueue.length,
                tracks: bulkDownloaderState.fetch.allSongs.size,
                isPaused: false,
                isStopped: true,
                source: bulkDownloaderState.fetch.source
            }, 'bulk');

            setPerfMode(false);
        });

        const downloadBtn = createElement('button', { id: 'suno-bulk-download', class: 'suno-btn btn-success' });
        downloadBtn.appendChild(createIcon('download'));
        downloadBtn.appendChild(createElement('span', { text: 'Download All' }));
        downloadBtn.disabled = true;
        downloadBtn.addEventListener('click', async () => {
            // First sync to ensure queue is up to date
            syncFetchStateToQueue();

            // Open Queue Modal with download ready
            showQueueModal();

            // Auto-start download from Queue Modal
            setTimeout(() => startQueueDownloadFromModal(), 500);
            return;

            // --- OLD DIRECT DOWNLOAD CODE (kept for reference) ---
            const span = downloadBtn.querySelector('span');
            if (!fetchState.download.inProgress) {
                fetchState.download.inProgress = true;
                fetchState.download.paused = false;
                updateIcon(downloadBtn, 'pause');
                span.textContent = 'Pause';
                let songs = window.__sunoSongsBulkList || [];
                if (!Array.isArray(songs) || !songs.length) {
                    toastManager.warning("No collected songs, please use 'Fetch All' first.");
                    fetchState.download.inProgress = false;
                    updateIcon(downloadBtn, 'download');
                    span.textContent = 'Download All';
                    return;
                }
                let done = fetchState.download.index || 0;
                let failed = fetchState.download.failed || 0;
                let skipped = 0;
                let total = songs.length;
                for (; fetchState.download.index < total; fetchState.download.index++) {
                    if (fetchState.download.paused) {
                        log("Downloads paused at", fetchState.download.index + 1);
                        updateIcon(downloadBtn, 'play');
                        span.textContent = 'Resume';
                        return;
                    }
                    const s = songs[fetchState.download.index];
                    const progress = document.querySelector('#suno-bulk-progress');

                    // Check if track is in no-duple list (already downloaded locally)
                    if (s.id && isTrackInDownloadedMatches(s.id)) {
                        skipped++;
                        log(`⏭️ Skipping "${s.title}" - already in no-duple list`);
                        if (progress) {
                            const layoutVersion = GM_getValue(GM_KEYS.layoutVersion, 'v1');
                            const isLayoutV2 = layoutVersion === 'v2';
                            const progressLabel = progress.querySelector('.progress-label');
                            if (progressLabel && isLayoutV2) {
                                progressLabel.textContent = ` Skipping (no-duple): ${s.title}`;
                            } else {
                                progress.textContent = `Skipping (no-duple): ${s.title}`;
                            }
                        }
                        // Update queue status to skipped
                        updateQueueTrackStatus(s.id, 'skipped', { reason: 'Already downloaded (no-duple)' });
                        await sleep(50); // Brief pause to show skip message
                        continue;
                    }

                    if (progress) {
                        const currentLayoutVersion = GM_getValue(GM_KEYS.layoutVersion, 'v1');
                        const isCurrentLayoutV2 = currentLayoutVersion === 'v2';
                        const progressLabel = progress.querySelector('.progress-label');
                        if (progressLabel && isCurrentLayoutV2) {
                            progressLabel.textContent = ` Downloading ${fetchState.download.index + 1} of ${total}: ${s.title}`;
                        } else {
                            progress.textContent = `Downloading ${fetchState.download.index + 1} of ${total}: ${s.title}`;
                        }
                    }

                    // Update queue status to downloading
                    if (s.id) updateQueueTrackStatus(s.id, 'downloading');

                    try {
                        if (typeof GM_download !== 'undefined') {
                            GM_download({ url: s.url, name: s.title, saveAs: false });
                        } else {
                            window.open(s.url, '_blank');
                        }
                        done++;
                        // Save to persistent storage with metadata to avoid re-downloading
                        if (s.id || s.url) {
                            saveBulkDownloaded(s.id || s.url, {
                                title: s.title,
                                url: s.url,
                                timestamp: Date.now(),
                                downloadStatus: 'completed'
                            });

                            // Update queue status to completed
                            updateQueueTrackStatus(s.id, 'completed', { downloadedAt: Date.now() });

                            // Add to download log
                            addToDownloadLog({
                                id: s.id,
                                title: s.title,
                                filename: s.filename || s.title,
                                url: s.url,
                                status: 'completed'
                            });
                        }
                        await sleep(WAIT_BETWEEN_DOWNLOADS);
                    } catch (e) {
                        failed++;
                        // Update queue status to failed
                        if (s.id) updateQueueTrackStatus(s.id, 'failed', { error: e.message });
                    }
                }
                const progress = document.querySelector('#suno-bulk-progress');
                const skipMsg = skipped > 0 ? `, Skipped (no-duple): ${skipped}` : '';
                if (progress) {
                    const currentLayoutVersion = GM_getValue(GM_KEYS.layoutVersion, 'v1');
                    const isCurrentLayoutV2 = currentLayoutVersion === 'v2';
                    const progressLabel = progress.querySelector('.progress-label');
                    if (progressLabel && isCurrentLayoutV2) {
                        progressLabel.textContent = ` Download finished! Success: ${done}, Failed: ${failed}${skipMsg}`;
                    } else {
                        progress.textContent = `Download finished! Success: ${done}, Failed: ${failed}${skipMsg}`;
                    }
                }
                fetchState.download.inProgress = false;
                fetchState.download.index = 0;
                fetchState.download.failed = 0;
                updateIcon(downloadBtn, 'download');
                span.textContent = 'Download All';
            } else {
                fetchState.download.paused = true;
                updateIcon(downloadBtn, 'play');
                span.textContent = 'Resume';
            }
        });

        // Update button classes and tooltips for Layout V2
        if (isLayoutV2) {
            fetchAllBtn.className = 'suno-btn btn-primary';
            fetchAllBtn.setAttribute('data-tooltip', 'Fetch All Tracks from the Workspace');
            fetchAllBtn.querySelector('span').textContent = 'Fetch All Tracks';

            pauseBtn.className = 'btn-warning suno-btn suno-btn-icon';
            pauseBtn.setAttribute('data-tooltip', 'Pause the Fetching or Bulk Downloading Process');

            stopBtn.className = 'btn-danger suno-btn suno-btn-icon';
            stopBtn.setAttribute('data-tooltip', 'Stop the Fetching or Bulk Downloading Process');

            downloadBtn.className = 'suno-btn btn-success';
            downloadBtn.setAttribute('data-tooltip', 'Bulk Download All Fetched Tracks');
            downloadBtn.querySelector('span').textContent = 'Bulk Download All';

            copyBtn.setAttribute('data-tooltip', 'Copy Fetched Tracks List to Clipboard');
            copyBtn.disabled = true;

            saveBtn.className = 'suno-btn btn-secondary';
            saveBtn.setAttribute('data-tooltip', 'Save Fetched Tracks List to .txt File');
            saveBtn.disabled = true;
        }

        if (isLayoutV2) {
            // Layout V2: Row 2 - Bulk Downloader (no help button here)
            const row2 = createElement('div', { class: 'suno-button-row', style: 'position: relative; padding-right: 40px;' });
            row2.appendChild(fetchAllBtn);

            // View Queue button
            const viewQueueBtn = createElement('button', {
                id: 'suno-bulk-view-queue',
                class: 'suno-btn btn-info',
                'data-tooltip': 'Open Queue Tab to view and manage Fetched Tracks and Downloads'
            });
            viewQueueBtn.appendChild(createIcon('list'));
            viewQueueBtn.appendChild(createElement('span', { text: 'View Queue' }));
            viewQueueBtn.addEventListener('click', () => {
                showQueueModal();
            });
            row2.appendChild(viewQueueBtn);

            row2.appendChild(stopBtn);
            row2.appendChild(pauseBtn);

            container.appendChild(row2);

            // Layout V2: Row 3 - Download Actions (with help button)
            const row3 = createElement('div', { class: 'suno-button-row', style: 'position: relative; padding-right: 40px;' });
            row3.appendChild(downloadBtn);
            row3.appendChild(copyBtn);
            row3.appendChild(saveBtn);

            // Help button for Download Actions (absolute right)
            const helpBtn3 = createElement('button', {
                class: 'suno-btn btn-transp',
                style: 'position: absolute; right: 0;',
                'data-tooltip': 'Help: Bulk Downloader'
            });
            helpBtn3.appendChild(createIcon('help-circle', '14px'));
            helpBtn3.addEventListener('click', () => showHelpModal('bulkDownloader'));
            row3.appendChild(helpBtn3);

            container.appendChild(row3);
        } else {
            // Layout V1: Original layout
            // Row 1: Copy and Save buttons
            const row1 = createElement('div', { class: 'suno-button-row' });
            row1.appendChild(copyBtn);
            row1.appendChild(saveBtn);
            container.appendChild(row1);

            // Row 2: Fetch All, Pause, Stop
            const row2 = createElement('div', { class: 'suno-button-row' });
            row2.appendChild(fetchAllBtn);
            row2.appendChild(pauseBtn);
            row2.appendChild(stopBtn);
            container.appendChild(row2);

            // Row 3: Download All + View Queue
            const row3 = createElement('div', { class: 'suno-button-row' });
            row3.appendChild(downloadBtn);

            const viewQueueBtn = createElement('button', {
                id: 'suno-bulk-view-queue',
                class: 'suno-btn btn-primary',
                'data-tooltip': 'Open Queue tab to view and manage fetched tracks'
            });
            viewQueueBtn.appendChild(createIcon('list'));
            viewQueueBtn.appendChild(createElement('span', { text: 'View Queue' }));
            viewQueueBtn.addEventListener('click', () => {
                showQueueModal();
            });
            row3.appendChild(viewQueueBtn);
            container.appendChild(row3);
        }

        // Store container ID for docking in Layout V2
        if (isLayoutV2) {
            container.id = 'suno-bulk-controls';
        }

        // Progress div is already created as titleRow in Layout V2
        // For Layout V1, we still need a separate progress div
        if (!isLayoutV2) {
            const progress = createElement('div', {
                id: 'suno-bulk-progress',
                class: 'suno-button-row suno-bulk-progress'
            });
            container.appendChild(progress);
        }

        // Table - only show in panel for Layout V1 (Layout V2 uses card's table)
        if (!isLayoutV2) {
            const tableScroll = createElement('div', { id: 'suno-bulk-table-scroll' });
            const table = createElement('table', { id: 'suno-bulk-table', class: 'suno-table' });

            const thead = createElement('thead');
            const headerRow = createElement('tr');
            const headers = [
                { text: '#', sortKey: 'index' },
                { text: 'Title', sortKey: 'title' },
                { text: 'URL', sortKey: 'url' }
            ];
            headers.forEach(({ text, sortKey }) => {
                const th = createElement('th', { text, 'data-sort-key': sortKey });
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = createElement('tbody', { id: 'suno-bulk-table-body' });
            table.appendChild(tbody);

            tableScroll.appendChild(table);
            container.appendChild(tableScroll);

            // Initialize table sorter after DOM is ready
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                setTimeout(() => {
                    if (table.isConnected && table.querySelector('thead') && table.querySelector('tbody')) {
                        try {
                            new TableSorter(table, { key: 'index', reverse: false });
                        } catch (e) {
                            console.warn('Failed to initialize TableSorter for panel table:', e);
                        }
                    }
                }, 150);
            });
        }

        return container;
    };

    // Legacy function name for compatibility - now creates integrated content
    const createBulkDownloaderPanel = () => {
        // This function is now a no-op - bulk content is created in buildToolPanelUI
    };

    /**************************************************************
     *   URL CHANGE HANDLER
     **************************************************************/
    const updateButtonStates = () => {
        const startBtn = document.querySelector('#activate-suno-script');
        const bulkBtn = document.querySelector('#suno-toggle-bulk');
        const statusBtn = document.querySelector('#suno-toggle-status');
        const fetchAllBtn = document.querySelector('#suno-bulk-all');
        const downloadBtn = document.querySelector('#suno-bulk-download');
        // Find copy and save buttons by checking their icon or text content
        const bulkContent = document.querySelector('.suno-bulk-content');
        let copyBtn = null, saveBtn = null;
        if (bulkContent) {
            const buttons = bulkContent.querySelectorAll('.suno-btn');
            buttons.forEach(btn => {
                const span = btn.querySelector('span');
                if (span) {
                    if (span.textContent.includes('Copy')) copyBtn = btn;
                    if (span.textContent.includes('Save')) saveBtn = btn;
                }
            });
        }

        if (startBtn) startBtn.disabled = !isCreatePage();
        // Bulk downloader is now always enabled (works on /create and /me)
        if (bulkBtn) bulkBtn.disabled = false;
        // Track Status button always enabled
        if (statusBtn) statusBtn.disabled = false;

        // Update bulk downloader button states
        const hasFetchedTracks = bulkDownloaderState.fetch.allSongs && bulkDownloaderState.fetch.allSongs.size > 0;
        const isFetching = bulkDownloaderState.isFetching;
        const isDownloading = bulkDownloaderState.isDownloading;
        const hasActiveProcess = isFetching || isDownloading;

        if (fetchAllBtn) {
            fetchAllBtn.disabled = hasActiveProcess;
            const span = fetchAllBtn.querySelector('span');
            if (span) {
                span.textContent = isFetching ? 'Fetching Tracks...' : 'Fetch All Tracks';
            }
        }

        if (downloadBtn) {
            downloadBtn.disabled = !hasFetchedTracks || hasActiveProcess;
        }

        if (copyBtn) {
            copyBtn.disabled = !hasFetchedTracks || hasActiveProcess;
        }

        if (saveBtn) {
            saveBtn.disabled = !hasFetchedTracks || hasActiveProcess;
        }
    };

    // Debug helper - expose storage inspection to console
    window.sunoDebug = {
        getStorage: () => ({
            trackHistory: trackHistory,
            downloadedKeys: downloadedKeys,
            bulkDownloaded: Array.from(fetchState.seenUrls),
            trackMetadata: Array.from(trackMetadata.entries())
        }),
        clearAllData: async () => {
            await GM_deleteValue(GM_KEYS.downloadedTracks);
            await GM_deleteValue(GM_KEYS.downloadedBulk);
            await GM_deleteValue(GM_KEYS.trackHistory);
            trackHistory = [];
            downloadedKeys = [];
            fetchState.seenUrls.clear();
            trackMetadata.clear();
            console.log('[Suno Debug] All data cleared');
        }
    };

    /**************************************************************
     *   UI WATCHDOG - Re-create elements if removed by React
     **************************************************************/
    const ensureUIExists = () => {
        // Check if main toolpanel exists
        if (!document.querySelector('#suno-panel')) {
            createNotificationContainer();
            createTrackTableContainer();
            buildToolPanelUI();
            updateButtonStates();
        }
    };

    /**************************************************************
     *   BUILD TOOLPANEL WITH BUTTONS
     **************************************************************/
    const buildToolPanelUI = () => {
        const panel = getToolPanel();

        // Clear existing controls and bulk content BEFORE rendering
        const panelElement = panel.panel || document.querySelector('#suno-panel');
        if (panelElement) {
            // Remove all existing bulk content sections
            const existingBulkContent = panelElement.querySelectorAll('.suno-bulk-content');
            existingBulkContent.forEach(content => {
                content.remove();
            });

            // Clear existing controls - remove all button rows
            const controls = panelElement.querySelector('#suno-panel-controls');
            if (controls) {
                const existingRows = controls.querySelectorAll('.suno-button-row');
                existingRows.forEach(row => row.remove());
            }
        }

        // Now render the panel (this ensures panel exists)
        panel.render();
        applyStoredUIFlags();

        // Ensure controls element exists (it should after render)
        if (!panel.controls) {
            panel.controls = panel.panel.querySelector('#suno-panel-controls');
        }

        // Example of using SunoUIBuilder for info section (if needed in future)
        // const infoSchema = {
        //     type: 'container',
        //     className: 'suno-info-section',
        //     children: [
        //         { type: 'text', label: 'Ready to automate', className: 'suno-status-text' }
        //     ]
        // };
        // const infoSection = new SunoUIBuilder(infoSchema).render();
        // panel.controls.appendChild(infoSection);

        // Row 1: Start and Stop buttons
        const startBtn = createSmartButton({
            id: 'activate-suno-script',
            text: 'Start Automation',
            icon: 'createMusic',
            classes: ['suno-btn', 'btn-primary'],
            tooltip: 'Start automated track generation',
            handlers: {
                onClick: () => startScriptWithPrompts()
            }
        });
        startBtn.getElement().disabled = !isCreatePage();

        const stopBtn = createSmartButton({
            id: 'stop-clicks-button',
            text: 'Stop Clicks',
            icon: 'stop',
            classes: ['suno-btn', 'btn-danger', 'suno-btn-icon'],
            tooltip: 'Stop the automation',
            handlers: {
                onClick: () => {
                    stopClicks = true;
                    stopBtn.setState('stopped');
                    stopBtn.disable();
                    panel.addLog('User stopped automation', 'warning');
                }
            },
            states: {
                stop: { text: 'Stop Clicks', icon: 'stop' },
                stopped: { text: 'Stopped', icon: 'check' }
            }
        });
        stopBtn.getElement().disabled = true;
        window.stopButton = stopBtn;

        // Pause button - pauses/resumes automation
        let automationPaused = false;
        const pauseBtn = createSmartButton({
            id: 'pause-automation-button',
            text: 'Pause Automation',
            icon: 'pause',
            classes: ['suno-btn', 'btn-pause', 'suno-btn-icon'],
            tooltip: 'Pause the Automation Progress',
            handlers: {
                onClick: () => {
                    automationPaused = !automationPaused;
                    window.automationPaused = automationPaused;
                    if (automationPaused) {
                        pauseBtn.setState('paused');
                        panel.addLog('Automation paused', 'warning');
                    } else {
                        pauseBtn.setState('default');
                        panel.addLog('Automation resumed', 'success');
                    }
                }
            },
            states: {
                default: { text: 'Pause', icon: 'pause' },
                paused: { text: 'Resume', icon: 'play' }
            }
        });
        pauseBtn.getElement().disabled = true;
        window.pauseButton = pauseBtn;
        window.automationPaused = false;

        const layoutVersion = GM_getValue(GM_KEYS.layoutVersion, 'v1');
        const isLayoutV2 = layoutVersion === 'v2';

        // Update button text for Layout V2
        if (isLayoutV2) {
            startBtn.getElement().querySelector('span').textContent = 'Start Generating';
            stopBtn.getElement().querySelector('span').textContent = 'Stop Clicks';
            pauseBtn.getElement().setAttribute('data-tooltip', 'Pause the Automation Progress');
        }

        // Row 1: Track Generation buttons (Layout V2) or combined (Layout V1)
        if (isLayoutV2) {
            // Layout V2: Row 1 - Track Generation
            const row1 = createElement('div', { class: 'suno-button-row', style: 'position: relative; padding-right: 40px;' });
            row1.appendChild(startBtn.getElement());

            const statusBtn = createSmartButton({
                id: 'suno-toggle-status',
                text: 'Track Status',
                icon: 'bar-chart',
                classes: ['suno-btn', 'btn-info'],
                tooltip: 'Show Track Generation Status Modal Panel',
                handlers: {
                    onClick: () => {
                        showTrackTableModal();
                    }
                }
            });
            statusBtn.getElement().disabled = false;
            window.statusButton = statusBtn;
            row1.appendChild(statusBtn.getElement());

            row1.appendChild(stopBtn.getElement());
            row1.appendChild(pauseBtn.getElement());

            // Help button for Track Generation (absolute right)
            const helpBtn1 = createElement('button', {
                class: 'suno-btn btn-transp',
                style: 'position: absolute; right: 0;',
                'data-tooltip': 'Help: Track Generation'
            });
            helpBtn1.appendChild(createIcon('help-circle', '14px'));
            helpBtn1.addEventListener('click', () => showHelpModal('trackGeneration'));
            row1.appendChild(helpBtn1);

            panel.controls.appendChild(row1);
        } else {
            // Layout V1: Original layout
            panel.addButtonRow([
                { element: startBtn.getElement() },
                { element: stopBtn.getElement() },
                { element: pauseBtn.getElement() }
            ]);

            // Row 2: Status and Bulk buttons
            const statusBtn = createSmartButton({
                id: 'suno-toggle-status',
                text: 'Track Status',
                icon: 'bar-chart',
                classes: ['suno-btn', 'btn-info'],
                tooltip: 'Show track generation status',
                handlers: {
                    onClick: () => {
                        showTrackTableModal();
                    }
                }
            });
            statusBtn.getElement().disabled = false;
            window.statusButton = statusBtn;

            const bulkBtn = createSmartButton({
                id: 'suno-toggle-bulk',
                text: 'Bulk Downloader',
                icon: 'download',
                classes: ['suno-btn'],
                tooltip: 'Toggle bulk downloader tools',
                handlers: {
                    onClick: () => {
                        const bulkContent = document.querySelector('.suno-bulk-content');
                        if (bulkContent) {
                            bulkContent.classList.toggle('open');
                        }
                    }
                }
            });
            window.bulkButton = bulkBtn;

            panel.addButtonRow([
                { element: statusBtn.getElement() },
                { element: bulkBtn.getElement() }
            ]);
        }

        // Add bulk downloader content (integrated into panel, after controls, before log wrapper)
        const bulkContent = createBulkDownloaderContent();
        if (bulkContent && panel.panel && panel.logWrapper) {
            // Insert bulk content between controls and log wrapper
            panel.panel.insertBefore(bulkContent, panel.logWrapper);
        }

        // Initialize log visibility
        updateLogVisibility();

        return panel;
    };

    /**************************************************************
     *   INITIALIZE ALL LIBRARIES
     **************************************************************/
    const initializeLibraries = async () => {
        try {
            injectIonicons();
            console.log('[Suno Extension] All libraries initialized');
        } catch (error) {
            console.error('[Suno Extension] Error initializing libraries:', error);
        }
    };

    /**************************************************************
     *   INITIALIZATION
     **************************************************************/
    waitForDOM(async () => {
        // Inject Ionicons library
        //injectIonicons();
        // Inject libraries first (Ionicons)
        await initializeLibraries();
        // Load persisted data first
        loadDownloadedTracks();
        loadBulkDownloaded();
        loadTrackHistory();
        loadDownloadedMatches(); // Deduplication: no-duple list
        loadImportedFilesCache(); // Deduplication: cached imported files
        loadFetchQueue(); // Fetch queue for bulk downloader
        loadDownloadLog(); // Download history log

        // Apply stored tooltip preference
        const tooltipsEnabled = GM_getValue(GM_KEYS.tooltipsEnabled, true);
        if (!tooltipsEnabled && window.tooltipManager) {
            tooltipManager.disable();
            log('Tooltips disabled (from saved preference)');
        }

        createNotificationContainer();
        createTrackTableContainer();
        buildToolPanelUI();
        initializeTextareaValidation();
        setup403Tracking();

        // Load progress card state for Layout V2
        loadProgressCardState();

        // Listen for URL changes
        window.addEventListener('popstate', () => setTimeout(updateButtonStates, 200));
        const originalPushState = history.pushState;
        history.pushState = function (...args) {
            originalPushState.apply(this, args);
            setTimeout(updateButtonStates, 200);
            setTimeout(ensureUIExists, 500);
        };
        const originalReplaceState = history.replaceState;
        history.replaceState = function (...args) {
            originalReplaceState.apply(this, args);
            setTimeout(updateButtonStates, 200);
            setTimeout(ensureUIExists, 500);
        };

        // Watchdog: check every 2 seconds if UI still exists
        setInterval(ensureUIExists, 2000);

        // Also watch for DOM mutations that might remove our elements
        const bodyObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.removedNodes.length > 0) {
                    for (const node of mutation.removedNodes) {
                        if (node.id === 'suno-panel' ||
                            node.id === 'suno-bulk-panel' ||
                            node.id === 'suno-track-table-container') {
                            setTimeout(ensureUIExists, 100);
                            return;
                        }
                    }
                }
            }
        });
        bodyObserver.observe(document.body, { childList: true });

        log('Suno Automation Loaded');
    });
})();