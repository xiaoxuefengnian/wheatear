# 布局

## 首页

首页代码 docs/.vuepress/theme/components/Home.vue

```vue
<template>
  <main class="home" aria-labelledby="main-title">
    <div class="main-content">
      <header class="hero">
        <img
          v-if="data.heroImage"
          :src="$withBase(data.heroImage)"
          :alt="data.heroAlt || 'hero'"
        />

        <h1 v-if="data.heroText !== null" id="main-title">
          {{ data.heroText || $title || "Hello" }}
        </h1>

        <p class="description">
          {{ data.tagline || $description || "Welcome" }}
        </p>

        <p class="action" v-if="data.actionText && data.actionLink">
          <NavLink class="action-button" :item="actionLink" />
        </p>
      </header>

      <section class="last-updated-files">
        <h3>最近更新</h3>

        <div class="links">
          <div
            class="link"
            v-for="(link, index) in lastUpdatedFiles"
            :key="index"
          >
            <span>
              {{ moment(link.timestamp).format("YYYY年MM月DD日") }}
            </span>
            <i class="el-icon-d-arrow-right"></i>
            <el-link :href="link.path" :underline="false">
              {{ `${link.title}` }}
            </el-link>
          </div>
        </div>
      </section>
    </div>

    <div class="features" v-if="data.features && data.features.length">
      <div
        class="feature"
        v-for="(feature, index) in data.features"
        :key="index"
      >
        <h2>{{ feature.title }}</h2>
        <p v-for="(detail, detailIndex) in feature.details" :key="detailIndex">
          {{ detail }}
        </p>
      </div>
    </div>

    <Content class="theme-default-content custom" />

    <div class="footer" v-if="data.footer">
      {{ data.footer }}
    </div>
  </main>
</template>

<script>
import NavLink from "@parent-theme/components/NavLink.vue";
import { Link } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import moment from "moment";

export default {
  components: {
    NavLink,
    [Link.name]: Link
  },

  computed: {
    data() {
      return this.$page.frontmatter;
    },

    actionLink() {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      };
    },

    lastUpdatedFiles() {
      return this.$page.lastUpdatedOfAllFiles
        ? Object.values(this.$page.lastUpdatedOfAllFiles)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10)
        : [];
    }
  },

  data() {
    return {
      moment
    };
  }
};
</script>

<style lang="stylus">
.home {
  padding: $navbarHeight 2rem 0;
  max-width: 960px;
  margin: 0px auto;
  display: block;

  .main-content {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: stretch;
    justify-content: space-around;
  }

  .hero {
    text-align: center;

    img {
      max-width: 100%;
      max-height: 280px;
      display: block;
      margin: 3rem auto 1.5rem;
      border-radius: 50%;
      box-shadow: 0 10px 5px #999;
    }

    h1 {
      font-size: 3rem;
    }

    h1, .description, .action {
      margin: 1.8rem auto;
    }

    .description {
      max-width: 35rem;
      font-size: 1.6rem;
      line-height: 1.3;
      color: lighten($textColor, 40%);
    }

    .action-button {
      display: inline-block;
      font-size: 1.2rem;
      color: #fff;
      background-color: $accentColor;
      padding: 0.8rem 1.6rem;
      border-radius: 4px;
      transition: background-color 0.1s ease;
      box-sizing: border-box;
      border-bottom: 1px solid darken($accentColor, 10%);

      &:hover {
        background-color: lighten($accentColor, 10%);
      }
    }
  }

  .last-updated-files {
    margin-top: 10rem;
    margin-left: 2rem;

    .links {
      max-height: 360px;
      overflow: auto;

      .link {
        user-select: none;

        > span {
          font-size: 14px;
          color: #909399;
        }

        > i {
          color: #909399;
        }
      }
    }
  }

  .features {
    border-top: 1px solid $borderColor;
    padding: 1.2rem 0;
    margin-top: 2.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: stretch;
    justify-content: space-between;
  }

  .feature {
    flex-grow: 1;
    flex-basis: 30%;
    max-width: 30%;

    h2 {
      font-size: 1.4rem;
      font-weight: 500;
      border-bottom: none;
      padding-bottom: 0;
      color: lighten($textColor, 10%);
    }

    p {
      color: lighten($textColor, 25%);

      &:last-of-type {
        padding-right: 1rem;
        text-align: right;
      }
    }
  }

  .footer {
    padding: 2.5rem;
    border-top: 1px solid $borderColor;
    text-align: center;
    color: lighten($textColor, 25%);
  }
}

@media (max-width: $MQMobile) {
  .home {
    .hero {
      width: 100%;
    }

    .last-updated-files {
      width: 100%;
      margin-top: 0;
    }

    .features {
      flex-direction: column;
    }

    .feature {
      max-width: 100%;
      padding: 0 2.5rem;
    }
  }
}

@media (max-width: $MQMobileNarrow) {
  .home {
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    .hero {
      width: 100%;

      img {
        max-height: 210px;
        margin: 2rem auto 1.2rem;
      }

      h1 {
        font-size: 2rem;
      }

      h1, .description, .action {
        margin: 1.2rem auto;
      }

      .description {
        font-size: 1.2rem;
      }

      .action-button {
        font-size: 1rem;
        padding: 0.6rem 1.2rem;
      }
    }

    .last-updated-files {
      width: 100%;
      margin-top: 0;
    }

    .feature {
      h2 {
        font-size: 1.25rem;
      }
    }
  }
}
</style>
```

## 最近更新列表

详见插件【[最近更新列表](/zh/搭建/plugins.html#最近更新列表)】
