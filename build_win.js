const config = {
  "appId": "jp.maplat.editor",
  "asarUnpack": [
    "assets/win/canvas"
  ],
  "directories": {
    "output": "dist"
  },
  "files": [
    "assets/win",
    "backend",
    "css",
    "frontend/dist",
    "frontend/fonts",
    "html",
    "img",
    "locales",
    "package.json",
    "package-lock.json",
    "tms_list.json"
  ],
  "mac": {
    "icon": "assets/win/icon_mac.icns",
    "target": [
      "dmg"
    ]
  },
  "win": {
    "icon": "assets/win/icon_win.ico",
    "target": "nsis"
  },
  "nsis":{
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  }
};

module.exports = config;