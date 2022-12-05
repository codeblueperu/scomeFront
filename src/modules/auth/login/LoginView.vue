<template>
  <main class="login">
    <div class="row">
      <div class="col-md-12">
        <h4 class="q-ml-lg q-mt-lg">LOGIN</h4>
        <small class="subtitle q-ml-lg"
          >Bienvenido, a continuación ingrese sus credenciales</small
        >
      </div>
    </div>
    <div class="q-pa-xl">
      <q-form @submit="onLogin" class="q-gutter-lg">
        <q-input
          filled
          v-model="emailuser"
          label="Email *"
          bottom-slots
          :error-message="
            dataError.hasOwnProperty('email') === false
              ? ''
              : dataError.email[0]
          "
          hint="Ingrese su email"
          :error="!isValidEmail"
        >
          <template v-slot:prepend>
            <q-icon name="account_circle" />
          </template>
        </q-input>

        <q-input
          v-model="password_user"
          filled
          :type="isTypeInput ? 'password' : 'text'"
          label="Contraseña"
          bottom-slots
          :error-message="
            dataError.hasOwnProperty('password') === false
              ? ''
              : dataError.password[0]
          "
          hint="Ingrese una contraseña"
          :error="!isValidClave"
        >
          <template v-slot:prepend>
            <q-icon name="security" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isTypeInput ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isTypeInput = !isTypeInput"
            />
          </template>
        </q-input>

        <q-toggle
          v-model="save_email"
          @click="onSaveEmail()"
          label="Recordar mi email"
        />

        <div class="flex justify-center items-center">
          <q-btn
            label="Ingresar"
            :disabled="btnsend"
            icon-right="login"
            type="submit"
            color="primary"
          />
        </div>
      </q-form>
    </div>
    <div class="q-mt-xl row flex justify-center items-center">
      <div class="col-md-4 flex justify-between items-center">
       <!--  <q-btn round color="primary" icon="mail" />
        <q-btn round color="amber" icon="phone_iphone" />
        <q-btn round color="secondary" icon="support_agent" /> -->
      </div>
    </div>
  </main>
</template>
<style scoped>
@import "login.css";
</style>
<script src="./login.ts"></script>
