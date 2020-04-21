<template>
  <div class="theme-container">
    <div class="theme-default-content">
      <section>
        <h1 class="animated bounce">404</h1>
        <blockquote class="animated fadeInLeft delay-1s">
          {{ msg }}
        </blockquote>
      </section>

      <section class="search-container animated fadeInLeft delay-3s">
        <span>在附近找找</span>
        <i class="el-icon-d-arrow-right arrow-right"></i>
        <i class="el-icon-d-arrow-right arrow-right"></i>
        <i class="el-icon-d-arrow-right arrow-right"></i>
        <SearchBox />
      </section>

      <section class="search-container animated fadeInLeft delay-5s">
        <router-link to="/">或者，去主人家看看。</router-link>
      </section>

      <!-- <section>
        <span>看看主人最近的收获。</span>
        <div class="links">
          <div class="link"
            v-for="(link, index) in newestFiles"
            :key="index">
            <span>
              {{moment(link.timestamp).format('YYYY年MM月DD日')}}
            </span>
            <i class="el-icon-d-arrow-right"></i>
            <el-link :href="link.path"
              :underline="false">
              {{`${link.title}`}}
            </el-link>
          </div>
        </div>
      </section> -->
    </div>
  </div>
</template>

<script>
import SearchBox from '@SearchBox'
import 'animate.css'
import {
  Icon,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

export default {
  components: {
    SearchBox,
    [Icon.name]: Icon,
  },

  data() {
    return {
      msg: `您正在找的麦穗似乎刚刚被人摘下。`,
    }
  },

  mounted() {

  },
  computed: {
    newestFiles() {
      // TODO: 获取不到 $page 后续处理
      return this.$page.lastUpdatedOfAllFiles
        ? Object.values(this.$page.lastUpdatedOfAllFiles)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10)
        : []
    },
  }
}
</script>

<style lang="stylus" scoped>
.search-container
  padding: 20px 0
  box-sizing: border-box

  .arrow-right
    font-size: 12px
    color: #909399
    margin-right: 5px

.links
  max-height: 360px
  overflow: auto

  .link
    user-select: none
    padding: 2px 0

    > span
      display: inline-block
      width: 100px
      font-size: 12px
      color: #909399

    > i
      font-size: 12px
      color: #909399
      margin-right: 5px
</style>
