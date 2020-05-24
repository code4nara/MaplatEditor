'use strict';

const electron = require('electron'); // eslint-disable-line no-undef
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const fs = require('fs-extra'); // eslint-disable-line no-undef
const openAboutWindow =require('about-window').default; // eslint-disable-line no-undef
const Settings = require('./settings'); // eslint-disable-line no-undef

let settings;
let mainWindow = null;

let force_quit = false;
const appWidth = 1200;
const appHeight = 800;

const isDev = isExistFile('.env');

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') // eslint-disable-line no-undef
        app.quit();
});

// This is another place to handle events after all windows are closed
app.on('will-quit', () => {
    // This is a good place to add tests insuring the app is still
    // responsive and all windows are closed.
    console.log("will-quit"); // eslint-disable-line no-console,no-undef
    mainWindow = null;
});

app.on('ready', async () => {
    settings = await Settings.asyncInit();
    const menu = setupMenu();
    Menu.setApplicationMenu(menu);

    // ブラウザ(Chromium)の起動, 初期画面のロード
    mainWindow = new BrowserWindow({width: appWidth, height: appHeight});
    const indexurl = `file://${__dirname.replace(/\\/g, '/')}/../../html/maplist.html`; // eslint-disable-line no-undef
    mainWindow.loadURL(indexurl);
    mainWindow.setMinimumSize(appWidth, appHeight);

    // Continue to handle mainWindow "close" event here
    mainWindow.on('close', (e) => {
        console.log("close"); // eslint-disable-line no-console,no-undef
        if(process.platform == 'darwin' && !force_quit){ // eslint-disable-line no-undef
            e.preventDefault();
            mainWindow.hide();
        }
    });

    // You can use 'before-quit' instead of (or with) the close event
    app.on('before-quit', () => {
        // Handle menu-item or keyboard shortcut quit here
        console.log("before-quit"); // eslint-disable-line no-console,no-undef
        force_quit = true;
    });

    app.on('activate', () => {
        console.log("reactive"); // eslint-disable-line no-console,no-undef
        mainWindow.show();
    });
});

function setupMenu() {
    const t = settings.t;
    // メニュー情報の作成
    const template = [
        {
            label: 'MaplatEditor',
            submenu: [
                {
                    label: 'Quit MaplatEditor',
                    accelerator: 'CmdOrCtrl+Q',
                    click() {
                        app.quit();
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: 'About MaplatEditor',
                    click() {
                        openAboutWindow({
                            icon_path: `file://${__dirname.replace(/\\/g, '/')}/../../img/icon.png`, // eslint-disable-line no-undef
                            product_name: 'MaplatEditor',
                            copyright: 'Copyright (c) 2015-2020 Code for History',
                            use_version_info: true
                        });
                    }
                },
            ]
        },
        {
            label: t("menu.edit"),
            submenu: [
                {
                    id:          'menu-undo',
                    label:       'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    enabled: false,
                    click(menuItem, focusedWin) {
                        // Undo.
                        // focusedWin.webContents.undo();

                        // Run some custom code.
                    }
                },
                {
                    id:          'menu-redo',
                    label:       'Redo',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    enabled: false,
                    click(menuItem, focusedWin) {
                        // Undo.
                        // focusedWin.webContents.undo();

                        // Run some custom code.
                    }
                }
                // { type: "separator" },
                // { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                // { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                // { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
                // { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
            ]
        }, /*{



        label: 'File',
        submenu: [
            {label: 'Open', accelerator: 'Command+O', click() {
                // 「ファイルを開く」ダイアログの呼び出し
                const {dialog} = require('electron'); // eslint-disable-line no-undef
                dialog.showOpenDialog({ properties: ['openDirectory']}, (baseDir) => {
                    if(baseDir && baseDir[0]) {
                        openWindow(baseDir[0]); // eslint-disable-line no-undef
                    }
                });
            }}
        ]
    }, */
    ];

    const devMenu = {
        label: 'Develop',
        submenu: [
            {label: 'Reload', accelerator: 'Command+R', click() {
                    BrowserWindow.getFocusedWindow().reload();
                }},
            {label: 'Toggle DevTools', accelerator: 'Alt+Command+I', click() {
                    BrowserWindow.getFocusedWindow().toggleDevTools();
                }}
        ]
    };

    if (isDev) template.push(devMenu);

    const menu = Menu.buildFromTemplate(template);
    return menu;
}

function isExistFile(file) {
    try {
        fs.statSync(file);
        return true;
    } catch(err) {
        if(err.code === 'ENOENT') return false;
    }
}