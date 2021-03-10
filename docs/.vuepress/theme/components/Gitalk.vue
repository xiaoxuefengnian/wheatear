<template>
  <div id="gitalk-container"
    class="gitalk-container">
  </div>
</template>

<script>
import Gitalk from 'gitalk';
import 'gitalk/dist/gitalk.css'

export default {
  data() {
    return {
      // gitalk 主要参数
      config: {
        clientID: '8d574eddbcf457d06015',
        clientSecret: 'aa3afa52ac5146fd49e2416cf28786ee43315739',
        repo: 'wheatear-talk',
        owner: 'xiaoxuefengnian-open',
        admin: ['xiaoxuefengnian-open'],
        id: 'talk',
        distractionFreeMode: false,
      }
    }
  },
  mounted() {
    const gitalk = new Gitalk(this.config);
    gitalk.render('gitalk-container');
  }
}
</script>

<style lang="stylus" scope>
.gitalk-container
  max-width $contentWidth
  margin 0 auto
  padding 0 2.5rem 2rem 2.5rem
  @media (max-width: $MQNarrow)
    padding 0 2rem 2rem 2rem
  @media (max-width: $MQMobileNarrow)
    padding 0 1.5rem 1.5rem 1.5rem
</style>
