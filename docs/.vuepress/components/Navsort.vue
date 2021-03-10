<template>
  <div class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd">

    <Navbar v-if="shouldShowNavbar"
      @toggle-sidebar="toggleSidebar" />

    <div class="sidebar-mask"
      @click="toggleSidebar(false)"></div>

    <Sidebar :items="sidebarItemsPlus"
      @toggle-sidebar="toggleSidebar">
      <slot name="sidebar-top"
        slot="top" />
      <slot name="sidebar-bottom"
        slot="bottom" />
    </Sidebar>

    <!-- 通过类名使用默认主题的样式 -->
    <main class="page">
      <!-- 通过类名使用默认主题的样式 -->
      <div class="theme-default-content content__default">
        <h1>导航菜单排序</h1>

        <section>
          <el-input placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
        </section>

        <section class="badge-desc">
          <span v-for="badge in badges"
            :key="badge.type">
            <el-badge :type="badge.type"
              is-dot>
            </el-badge>
            {{badge.desc}}
          </span>

          <span class="sort-info">
            <span>未排序个数：{{unsortedLinksLength}}</span>
            <span>排序已改变个数：{{changedLinksLength}}</span>
            <el-button @click="handleSave"
              :disabled="changedLinksLength === 0 && unsortedLinksLength.length === 0"
              type="primary"
              circle
              size="mini">存</el-button>
          </span>
        </section>

        <section>
          <el-tree :data="navTree"
            node-key="link"
            default-expand-all
            draggable
            @node-drag-end="handleDragEnd"
            icon-class="el-icon-s-flag"
            :filter-node-method="filterNode"
            :props="defaultProps"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            ref="tree">
            <span class="custom-tree-node"
              slot-scope="{node, data}">
              <span class="custom-tree-node-text"
                :class="`custom-tree-node-text-${sortType(data.link)}`">
                {{data.originName}}
              </span>
              <el-badge :type="sortType(data.link)"
                is-dot>
              </el-badge>
            </span>
          </el-tree>
        </section>
      </div>
    </main>

  </div>
</template>

<script>
import Navbar from '@theme/components/Navbar.vue'
import Sidebar from '@parent-theme/components/Sidebar.vue'
import { resolveSidebarItems } from '@theme/util'

import axios from 'axios';
import qs from "qs";
// 引入 element-ui
import {
  Button,
  Tree,
  Badge,
  Input,
  Message,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

export default {
  components: {
    Sidebar, Navbar,
    [Button.name]: Button,
    [Tree.name]: Tree,
    [Badge.name]: Badge,
    [Input.name]: Input,
  },

  data() {
    return {
      isSidebarOpen: false,

      defaultProps: {
        children: 'children',
        label: 'originName',
      },

      badges: [
        {
          type: 'success',
          desc: '已排序',
        },
        {
          type: 'warning',
          desc: '排序已改变',
        },
        {
          type: 'info',
          desc: '未排序',
        },
      ],

      navTree: [],
      navSort: [],

      originNavTreeSort: [],

      filterText: '',
    }
  },

  computed: {
    shouldShowNavbar() {
      const { themeConfig } = this.$site
      const { frontmatter } = this.$page
      if (
        frontmatter.navbar === false
        || themeConfig.navbar === false) {
        return false
      }
      return (
        this.$title
        || themeConfig.logo
        || themeConfig.repo
        || themeConfig.nav
        || this.$themeLocaleConfig.nav
      )
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page
      return (
        !frontmatter.home
        && frontmatter.sidebar !== false
        && this.sidebarItems.length
      )
    },

    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      )
    },

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar
        },
        userPageClass
      ]
    },

    /**
     * 给 sidebarItems 赋名称 
     * 因为 YAML front matter 未获取到一级标题
     */
    sidebarItemsPlus() {
      if (this.sidebarItems.length > 0) {
        this.sidebarItems[0].children.forEach(x => {
          x.title = /\/([^/]+)\.html/.exec(x.path)[1]
        });
      }
      return this.sidebarItems;
    },

    changedLinksLength() {
      return this.originNavTreeSort.filter((x, i) => {
        return i !== this.currentNavTreeSort.findIndex(y => y === x)
      }).length;
    },

    unsortedLinksLength() {
      return this.currentNavTreeSort.length - this.navSort.length;
    },

    currentNavTreeSort() {
      const newSort = [];
      const recursion = (array) => {
        array.forEach(x => {
          newSort.push(x.link);
          if (Array.isArray(x.children) && x.children.length > 0) {
            recursion(x.children);
          }
        });
      }
      recursion(this.navTree);
      return newSort;
    },
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false
    })

    window.vue = this;

    this.init();
  },

  methods: {
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
    },

    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true)
        } else {
          this.toggleSidebar(false)
        }
      }
    },

    DefaultValues() {
      return {
        originNavTreeSort: [],
      }
    },

    init() {
      Promise.all([
        this.getNavTree(),
        this.getNavSort(),
      ])
        .then(() => {
          this.originNavTreeSort = JSON.parse(JSON.stringify(this.DefaultValues().originNavTreeSort));
          const recursion = (array) => {
            array.forEach(x => {
              this.originNavTreeSort.push(x.link);
              if (Array.isArray(x.children) && x.children.length > 0) {
                recursion(x.children);
              }
            });
          }
          recursion(this.navTree);
          this.navSort = this.navSort.filter(x => this.originNavTreeSort.includes(x));
        })
        .catch(() => { })
    },

    async getNavTree() {
      return axios.get('/serve/nav/tree')
        .then(res => {
          const { data } = res.data;
          this.navTree = JSON.parse(data);
        })
        .catch(() => {
          Message.error('获取【导航菜单树】失败');
        })
    },

    async getNavSort() {
      return axios.get('/serve/nav/sort')
        .then(res => {
          const { data } = res.data;
          this.navSort = JSON.parse(data);
        })
        .catch(() => {
          Message.error('获取【导航菜单排序】失败');
        })
    },

    async setNavTree(tree) {
      return axios({
        url: '/serve/nav/tree',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: { data: tree }
      })
        .then(() => { })
        .catch(() => {
          Message.error('设置【导航菜单树】失败');
        })
    },

    async setNavSort(sort) {
      return axios({
        url: '/serve/nav/sort',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: { data: sort }
      })
        .then(res => {
          const { resultCode } = res.data;
          if (resultCode === 1) {
            this.init();
          }
        })
        .catch(() => {
          Message.error('设置【导航菜单排序】失败');
        })
    },

    handleSave() {
      Promise.all([
        this.setNavTree(this.navTree),
        this.setNavSort([...this.currentNavTreeSort]),
      ])
        .then(() => {
          Message.success('排序保存成功');
        })
        .catch(() => { })
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.link.indexOf(value) !== -1;
    },

    sortType(link) {
      const originIndex = this.originNavTreeSort.findIndex(x => x === link);
      const currentIndex = this.currentNavTreeSort.findIndex(x => x === link);
      if (originIndex === currentIndex) {
        if (this.navSort.includes(link)) {
          // 已排序
          return 'success'
        } else {
          // 未排序
          return 'info';
        }
      }
      // 排序已改变
      return 'warning';

    },

    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      // 拖拽放置未成功
      if (dropType === 'none') return;
    },

    allowDrop(draggingNode, dropNode, type) {
      // 不能改变菜单层级
      if (type === 'inner') return false;
      // 只能改变同层级前后顺序
      return draggingNode.parent === dropNode.parent;
    },

    allowDrag(draggingNode) {
      return true;
    }
  }
  // end
}
</script>

<style scoped>
.theme-default-content section {
  margin: 10px 0;
}

.badge-desc {
  font-size: 12px;
  color: #aaa;
}

.badge-desc .el-badge {
  top: 2px;
  margin-left: 8px;
}

.sort-info {
  margin-left: 10px;
}

.sort-info > span {
  margin-right: 10px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node-text {
  padding: 2px 3px;
}
.custom-tree-node-text-warning {
  color: #fff;
  background-color: #e6a23c;
}
.custom-tree-node-text-info {
  color: #fff;
  background-color: #909399;
}
</style>