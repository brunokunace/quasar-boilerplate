<template>
  <div class="app-crud-grid">
    <app-button-bar :buttons="buttons.top" :handler="handler" :direction="direction"/>

    <hr>
    <app-form ref="form" v-bind="{fields, data}" @form~input="input" @form~valid="valid"></app-form>
    <hr>

    <app-button-bar :buttons="buttons.top" :handler="handler" :direction="direction"/>

    <div class="fixed-bottom-right">
      <app-button-bar :buttons="buttons.floating" :handler="handler"/>
    </div>

    <template v-if="debugging">
      <app-debugger v-bind="{label: 'data', inspect: data}"></app-debugger>
      <app-debugger v-bind="{label: 'fields', inspect: fields}"></app-debugger>
    </template>
  </div>
</template>

<script type="text/javascript">
  import { mapActions } from 'vuex'
  import populateForm from 'src/bootstrap/populate/form'
  import AppForm from 'src/themes/phpzm/components/form/AppForm.vue'
  import AppButtonBar from 'src/themes/phpzm/components/button/AppButtonBar.vue'
  import { MixinComputed, MixinData, MixinMethods, MixinProps } from './model'

  /**
   * @type {Object}
   * @property data
   */
  const AppCrudForm = {
    components: {
      AppForm, AppButtonBar
    },
    mixins: [
      MixinComputed, MixinData, MixinMethods, MixinProps
    ],
    name: 'app-crud-form',
    props: {
      scope: {
        default: () => 'view'
      },
      handlers: {
        type: Object,
        default () {
          return {
            create: (response) => this.setAppModified(false),
            read: (response) => populateForm(this, response),
            update: (response) => this.setAppModified(false),
            delete: (response) => this.browse(this.path)
          }
        }
      }
    },
    data: () => ({
      fields: {},
      data: {},
      status: false
    }),
    methods: {
      /**
       */
      renderElements () {
        const map = item => {
          const readonly = this.scopes[this.scope] && this.scopes[this.scope].readonly
          return Object.assign({}, item.form, {
            disabled: readonly ? true : item.form.disabled,
            field: item.form.field,
            component: this.component + '-' + item.form.component
          })
        }
        const filter = item => item.scopes.includes(this.scope)

        this.fields = this.schemas.filter(filter).map(map)
      },
      /**
       * @param {AxiosError} error
       * @param {string} method
       * @param {Array} parameters
       */
      catch (error, method, parameters) {
        console.log('~>', this.$options.name, error)
      },
      input (data) {
        this.data = data
        this.setAppModified(true)
      },
      /**
       * @param {boolean} valid
       */
      valid (valid) {
        this.status = valid
      },
      ...mapActions(['setAppModified'])
    },
    watch: {
      status () {
        this.renderActions()
      }
    },
    created () {
      this.renderAll()
    },
    mounted () {
      if (this.id && this.$route.params[this.id]) {
        const fetch = () => {
          this.read(this.$route.params[this.id])
        }
        window.setTimeout(fetch, 100)
      }
    }
  }
  export default AppCrudForm
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .app-crud-grid
    padding 16px 0 0 0
    hr
      margin 10px 0
    .fixed-bottom-right
      margin 5px
</style>
