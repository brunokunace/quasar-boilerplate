<template>
  <div class="app-form">
    <q-tabs v-if="tabs.length">
      <!-- Tabs - notice slot="title" -->
      <q-tab v-for="tab in tabs" :key="tab.name" slot="title" v-bind="tab"/>
      <!-- Targets -->
      <q-tab-pane v-for="tab in tabs" :key="tab.name" :name="tab.name">
        <div class="form">
          <component v-for="schema in components[tab]" :key="schema.field" :is="schema.component"
                     v-bind="schema" v-model="record[schema.field]"
                     @input="formInput(schema.field)" @event="formEvent"></component>
        </div>
      </q-tab-pane>
    </q-tabs>
    <div v-else class="form">
      <component v-for="schema in schemas" :key="schema.field" :is="schema.component"
                 v-bind="schema" v-model="record[schema.field]"
                 @input="formInput(schema.field)" @event="formEvent"></component>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { validationMixin as validation } from 'vuelidate'
  import { data, methods, props, watch } from './model'

  export default {
    mixins: [validation, data, methods, props, watch],
    name: 'app-form',
    validations () {
      const validations = this.generateValidations(this.fields)
      return {
        record: validations
      }
    },
    created () {
      this.updateComponents()
      this.updateSchemas()
      this.updateRecord()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .app-form
    font-family Roboto
</style>
