<template>
  <footer
    class="relative pt-10 pb-6"
    :class="{
      'bg-blueGray-200 text-blueGray-700': theme === 'light',
      'bg-gray-800 text-gray-200': theme === 'dark'
    }"
  >
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-row text-left lg:text-left">
        <div class="w-full lg:w-6/12 px-4">
          <h4
            class="text-3xl fonat-semibold"
            :class="{
              'text-blueGray-700': theme === 'light',
              'text-gray-200': theme === 'dark'
            }"
          >
            Let's keep in touch!
          </h4>
          <h5
            class="text-lg mt-0 mb-2"
            :class="{
              'text-blueGray-600': theme === 'light',
              'text-gray-400': theme === 'dark'
            }"
          >
            Find us on any of these platforms, we respond 1-2 business days.
          </h5>
          <div class="mt-6 lg:mb-0 mb-6">
            <button
              class="shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
              type="button"
              :class="{
                'bg-white': theme === 'light',
                'bg-gray-700': theme === 'dark'
              }"
            >
              <i
                class="fab fa-twitter"
                :class="{
                  'text-lightBlue-400': theme === 'light',
                  'text-white': theme === 'dark'
                }"
              ></i>
            </button>
            <button
              class="shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
              type="button"
              :class="{
                'bg-white': theme === 'light',
                'bg-gray-700': theme === 'dark'
              }"
            >
              <i
                class="fab fa-facebook-square"
                :class="{
                  'text-lightBlue-600': theme === 'light',
                  'text-white': theme === 'dark'
                }"
              ></i>
            </button>
            <button
              class="shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
              type="button"
              :class="{
                'bg-white': theme === 'light',
                'bg-gray-700': theme === 'dark'
              }"
            >
              <i
                class="fab fa-dribbble"
                :class="{
                  'text-pink-400': theme === 'light',
                  'text-white': theme === 'dark'
                }"
              ></i>
            </button>
            <button
              class="shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
              type="button"
              :class="{
                'bg-white': theme === 'light',
                'bg-gray-700': theme === 'dark'
              }"
            >
              <i
                class="fab fa-github"
                :class="{
                  'text-blueGray-800': theme === 'light',
                  'text-white': theme === 'dark'
                }"
              ></i>
            </button>
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="flex flex-row items-top mb-6">
            <div class="w-full lg:w-4/12 px-4 ml-auto">
              <span
                class="block uppercase text-sm font-semibold mb-2"
                :class="{
                  'text-blueGray-500': theme === 'light',
                  'text-gray-400': theme === 'dark'
                }"
                >Useful Links</span
              >
              <ul class="list-unstyled">
                <li>
                  <a
                    class="font-semibold block pb-2 text-sm"
                    href="https://www.creative-tim.com/presentation?ref=njs-profile"
                    :class="{
                      'text-blueGray-600 hover:text-blueGray-800': theme === 'light',
                      'text-gray-400 hover:text-gray-300': theme === 'dark'
                    }"
                    >About Us</a
                  >
                </li>
                <li>
                  <a
                    class="font-semibold block pb-2 text-sm"
                    href="https://blog.creative-tim.com?ref=njs-profile"
                    :class="{
                      'text-blueGray-600 hover:text-blueGray-800': theme === 'light',
                      'text-gray-400 hover:text-gray-300': theme === 'dark'
                    }"
                    >Blog</a
                  >
                </li>
                <li>
                  <a
                    class="font-semibold block pb-2 text-sm"
                    href="https://www.github.com/creativetimofficial?ref=njs-profile"
                    :class="{
                      'text-blueGray-600 hover:text-blueGray-800': theme === 'light',
                      'text-gray-400 hover:text-gray-300': theme === 'dark'
                    }"
                    >Github</a
                  >
                </li>
             
              </ul>
            </div>
            <div class="w-full lg:w-4/12 px-4">
              <span
                class="block uppercase text-sm font-semibold mb-2"
                :class="{
                  'text-blueGray-500': theme === 'light',
                  'text-gray-400': theme === 'dark'
                }"
                >Other Resources</span
              >
              <ul class="list-unstyled">
                <li>
                  <a
                    class="font-semibold block pb-2 text-sm"
                    href="https://github.com/creativetimofficial/notus-js/blob/main/LICENSE.md?ref=njs-profile"
                    :class="{
                      'text-blueGray-600 hover:text-blueGray-800': theme === 'light',
                      'text-gray-400 hover:text-gray-300': theme === 'dark'
                    }"
                    >MIT License</a
                  >
                </li>
                <li>
                  <a
                    class="font-semibold block pb-2 text-sm"
                    href="https://creative-tim.com/terms?ref=njs-profile"
                    :class="{
                      'text-blueGray-600 hover:text-blueGray-800': theme === 'light',
                      'text-gray-400 hover:text-gray-300': theme === 'dark'
                    }"
                    >Terms &amp; Conditions</a
                  >
                </li>
                <li>
                  <a
                    class="font-semibold block pb-2 text-sm"
                    href="https://creative-tim.com/privacy?ref=njs-profile"
                    :class="{
                      'text-blueGray-600 hover:text-blueGray-800': theme === 'light',
                      'text-gray-400 hover:text-gray-300': theme === 'dark'
                    }"
                    >Privacy Policy</a
                  >
                </li>
                <li>
                  <a
                    class="font-semibold block pb-2 text-sm"
                    href="https://creative-tim.com/contact-us?ref=njs-profile"
                    :class="{
                      'text-blueGray-600 hover:text-blueGray-800': theme === 'light',
                      'text-gray-400 hover:text-gray-300': theme === 'dark'
                    }"
                    >Contact Us</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <hr
        class="my-6 border-blueGray-300"
        :class="{ 'border-blueGray-300': theme === 'light', 'border-gray-700': theme === 'dark' }"
      />

      <div class="flex flex-wrap items-center md:justify-between justify-center">
        <div class="w-full md:w-4/12 px-4 mx-auto text-center">
          <div
            class="text-sm font-semibold py-1"
            :class="{
              'text-blueGray-500': theme === 'light',
              'text-gray-400': theme === 'dark'
            }"
          >
            Copyright © <span id="get-current-year">{{ currentYear }}</span
            ><a
              href="www.vinscollections.shop"
              class=""
              target="_blank"
              :class="{
                'text-blueGray-500 hover:text-gray-800': theme === 'light',
                'text-gray-400 hover:text-gray-300': theme === 'dark'
              }"
            >
              Vins collections by</a
            >
            <a
              href="https://mikeygotcodeportfolio.netlify.app/"
              class=""
              :class="{
                'text-blueGray-500 hover:text-blueGray-800': theme === 'light',
                'text-gray-400 hover:text-gray-300': theme === 'dark'
              }"
              >Mikey-gotcode</a
            >.
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { inject, ref } from 'vue';
import '@fortawesome/fontawesome-free/css/all.min.css';

const theme = inject('theme');
const currentYear = ref(new Date().getFullYear());
</script>