<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      cols="12"
      sm="12"
      md="6"
      lg="3"
    >
      <v-hover v-slot="{ hover }">
        <v-card :elevation="hover ? 24 : 2">
          <v-card-title>
            <v-container>
              <v-row
                align="center"
                justify="center"
              >
                Sign in with
              </v-row>
              <v-row
                align="center"
                justify="center"
                class="mt-5"
              >
                <v-btn
                  text
                  class="mr-2"
                >
                  <v-icon class="mr-3">
                    mdi-google
                  </v-icon>
                  Google
                </v-btn>
                <v-btn text>
                  <v-icon class="mr-5">
                    mdi-github
                  </v-icon>
                  Github
                </v-btn>
              </v-row>
            </v-container>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-container>
              <form>
                <v-text-field
                  v-model="name"
                  :error-messages="nameErrors"
                  :counter="20"
                  label="Name"
                  required
                  outlined
                  @input="$v.name.$touch()"
                  @blur="$v.name.$touch()"
                  clearable
                />
                <v-text-field
                  v-model="email"
                  :error-messages="emailErrors"
                  label="E-mail"
                  required
                  outlined
                  @input="$v.email.$touch()"
                  @blur="$v.email.$touch()"
                  clearable
                />
                <v-text-field
                  v-model="username"
                  :error-messages="usernameErrors"
                  label="Username"
                  required
                  outlined
                  @input="$v.username.$touch()"
                  @blur="$v.username.$touch()"
                  clearable
                />
                <v-text-field
                  v-model="password"
                  :error-messages="passwordErrors"
                  label="Password"
                  required
                  outlined
                  @input="$v.password.$touch()"
                  @blur="$v.password.$touch()"
                  clearable
                />
                <v-text-field
                  v-model="repassword"
                  :error-messages="repasswordErrors"
                  label="Re-Password"
                  required
                  outlined
                  @input="$v.repassword.$touch()"
                  @blur="$v.repassword.$touch()"
                  clearable
                />
                <v-checkbox
                  v-model="checkbox"
                  :error-messages="checkboxErrors"
                  label="Do you agree?"
                  required
                  @change="$v.checkbox.$touch()"
                  @blur="$v.checkbox.$touch()"
                />
                <v-btn
                  class="mr-4"
                  @click="submit"
                  color="primary"
                >
                  submit
                </v-btn>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>
</template>
<script>
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  email,
  sameAs,
  minLength,
} from "vuelidate/lib/validators";

export default {
  data: () => ({
    name: "",
    email: "",
    select: null,
    checkbox: false,
    password: "",
    repassword: "",
    username: "",
  }),
  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(20) },
    email: { required, email },
    username: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(20),
    },
    password: {
      required,
      minLength: minLength(6),
    },
    repassword: {
      sameAs: sameAs("password"),
    },
    checkbox: {
      checked(val) {
        return val;
      },
    },
  },
  computed: {
    checkboxErrors() {
      const errors = [];
      if (!this.$v.checkbox.$dirty) return errors;
      !this.$v.checkbox.checked && errors.push("You must agree to continue!");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required");
      !this.$v.password.minLength &&
        errors.push("Password must be greater than 6 characters");
      return errors;
    },
    repasswordErrors() {
      const errors = [];
      if (!this.$v.repassword.$dirty) return errors;
      !this.$v.repassword.sameAs &&
        errors.push("Re-Password should be same as Password");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Name must be at most 20 characters long");
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.required && errors.push("Username is required");
      !this.$v.username.minLength &&
        errors.push("Username must be above 2 characters");
      !this.$v.username.maxLength &&
        errors.push("Username must be less than 20 characters");
      return errors;
    },
  },
  methods: {
    submit() {
      this.$v.$touch();
    },
  },
};
</script>

