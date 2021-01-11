import Wookmark from 'wookmark/wookmark';
import Vue from 'vue';
import {Language} from './model/language';
import Header from '../vue/header.vue';

const {ipcRenderer} = require('electron'); // eslint-disable-line no-undef
const langObj = new Language();

async function initRun() {
  new Vue({
    i18n: langObj.vi18n,
    mounted() {
      const self = this;

      const backend = require('electron').remote.require('./maplist'); // eslint-disable-line no-undef
      backend.request();

      ipcRenderer.on('mapListAdd', (event, arg) => {
        const map = {
          mapID: arg.mapID,
          name: arg.title,
        };
        if (!arg.width || !arg.height || !arg.thumbnail) {
          map.width = 190;
          map.height = 190;
          map.image = '../img/no_image.png';
        } else {
          map.width = arg.width > arg.height ? 190 : Math.floor(190 / arg.height * arg.width);
          map.height = arg.width > arg.height ? Math.floor(190 / arg.width * arg.height) : 190;
          map.image = arg.thumbnail;
        }

        self.maplist.push(map);
        self.maplist = self.maplist.sort((a, b) => {
          if (a.mapID < b.mapID) return -1;
          if (a.mapID > b.mapID) return 1;
          // a は b と等しいはず
          return 0;
        });

        Vue.nextTick(() => {
          new Wookmark('#maplist');
        });
      });
      Vue.nextTick(() => {
        new Wookmark('#maplist');
      });
    },
    el: '#container',
    template: "#maplist-vue-template",
    components: {
      "header-template": Header
    },
    data: {
      maplist: []
    }
  });
}

initRun();
