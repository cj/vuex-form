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
        <div class="first_name">{{ user && user.first_name }}</div>
      </div>
    </main>
  </div>
</template>

<script>
  import * as constants from '../constants'

  const {
    // Actions
    NEW_FORM,

    // Getters
    FORM_VALUES
  } = constants

  export default {
    methods: {
      handleSubmit(data) {
        console.log(data)
      }
    },
    computed: {
      user() {
        return this.$store.getters[FORM_VALUES]('signup').user
      }
    }
  }
</script>
