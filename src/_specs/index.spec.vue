<template>
  <div>
    <form name="signup" v-vuex-form="handleSubmit">
      <input name="user_id" type="hidden" v-vuex-form:input="{required: true}" />
      <input name="user[first_name]" type="text" v-vuex-form:input="{ required: true }" />
      <input name="user[last_name]" type="text" v-vuex-form:input="{ required: true }" />
    </form>
    <main>
      <div>
        <h1>User Firstname</h1>
        <div class="first_name">{{ formData.length && formData.user.first_name }}</div>
      </div>
    </main>
  </div>
</template>

<script>
  import { constants } from '../index'

  const { FORM_DATA } = constants

  export default {
    methods: {
      handleSubmit(data) {
        console.log(data)
      }
    },
    computed: {
      formData() {
        return this.$store.getters[FORM_DATA]('signup')
      }
    }
  }
</script>
