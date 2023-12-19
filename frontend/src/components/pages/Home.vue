<script>
export default {
  data: () => ({
    reveal: false,
    reveal1: false,
    reveal2: false,
  }),
  methods: {
    SuchenNachPerson() {
      this.$router.push('/SuchPerson');
    },
  },
};
</script>
<!-- Text mittig setzen-Zeile 27: class="d-flex align-center text-center bg-shades-white"  -->
<template>
<v-container>
    <v-row justify="space-around">
      <v-card min-width="1400" >
        <v-img height="600" src="/images/Bild1.jpg" cover>
          <v-card
            variant="tonal"
            max-width="500"
            height="600"
            rounded="0"
            position="static"
            class="text-center bg-shades-white"
            title="Finden Sie Ihre Familie. Entdecken Sie selbst!"
         text="Erwecken Sie die Geschichte Ihrer Familie zum Leben, indem Sie das Leben derer erkunden, die vor Ihnen lebten "
         >
         <v-card-actions class="justify-center">
           <v-btn variant="tonal" @click="SuchenNachPerson">Click me</v-btn>
         </v-card-actions>
       </v-card>
     </v-img>
   </v-card>
 </v-row>
</v-container>

<h1 class="pa-md-15 mx-lg-auto text-center">How to</h1>

<v-container>
 <v-row align="center" justify="center">
   <v-card class="mx-auto" max-width="344" variant="outlined" >
     <v-card-item>
       <div>
         <div class="text-overline mb-1">Hinweis für Sie</div>
         <div class="text-h4 mb-1">Step 1</div>
         <div class="text-caption">
           I'm a thing. But, like most politicians, he promised more than he
           could deliver. You won't have time for sleeping, soldier, not with
           all the bed making you'll be doing.
         </div>
       </div>
     </v-card-item>

     <v-card-actions>
       <v-btn variant="text" @click="reveal = true"> Weiterlesen </v-btn>
     </v-card-actions>

     <v-expand-transition>
       <v-card v-if="reveal" class="v-card--reveal" style="height: 100%">
         <v-card-text class="pb-0">
           <p>
             late 16th century (as a noun denoting a place where alms were
             distributed): from medieval Latin eleemosynarius, from late
             Latin eleemosyna ‘alms’, from Greek eleēmosunē ‘compassion’
           </p>
         </v-card-text>
         <v-card-actions class="pt-0">
           <v-btn variant="text" @click="reveal = false"> Close </v-btn>
         </v-card-actions>
       </v-card>
     </v-expand-transition>
   </v-card>

   <v-card class="mx-auto" max-width="344" variant="outlined">
     <v-card-item>
       <div>
         <div class="text-overline mb-1">Hinweis für Sie</div>
         <div class="text-h4 mb-1">Step 2</div>
         <div class="text-caption">
           I'm a thing. But, like most politicians, he promised more than he
           could deliver. You won't have time for sleeping, soldier, not with
           all the bed making you'll be doing.
         </div>
       </div>
     </v-card-item>

     <v-card-actions>
       <v-btn variant="text" @click="reveal1 = true"> Weiterlesen </v-btn>
     </v-card-actions>

     <v-expand-transition>
       <v-card v-if="reveal1" class="v-card--reveal" style="height: 100%">
         <v-card-text class="pb-0">
           <p>
             late 16th century (as a noun denoting a place where alms were
             distributed): from medieval Latin eleemosynarius, from late
             Latin eleemosyna ‘alms’, from Greek eleēmosunē ‘compassion’
           </p>
         </v-card-text>
         <v-card-actions class="pt-0">
           <v-btn variant="text" @click="reveal1 = false"> Close </v-btn>
         </v-card-actions>
       </v-card>
     </v-expand-transition>
   </v-card>

   <v-card class="mx-auto" max-width="344" variant="outlined">
     <v-card-item>
       <div>
         <div class="text-overline mb-1">Hinweis für Sie</div>
         <div class="text-h4 mb-1">Step 3</div>
         <div class="text-caption">
           I'm a thing. But, like most politicians, he promised more than he
           could deliver. You won't have time for sleeping, soldier, not with
           all the bed making you'll be doing.
         </div>
       </div>
     </v-card-item>

     <v-card-actions>
       <v-btn variant="text" @click="reveal2 = true"> Weiterlesen </v-btn>
     </v-card-actions>

     <v-expand-transition>
       <v-card v-if="reveal2" class="v-card--reveal" style="height: 100%">
         <v-card-text class="pb-0">
           <p>
             late 16th century (as a noun denoting a place where alms were
             distributed): from medieval Latin eleemosynarius, from late
             Latin eleemosyna ‘alms’, from Greek eleēmosunē ‘compassion’
           </p>
         </v-card-text>
         <v-card-actions class="pt-0">
           <v-btn variant="text" @click="reveal2 = false"> Close </v-btn>
         </v-card-actions>
       </v-card>
     </v-expand-transition>
   </v-card>
 </v-row>
</v-container>


</template>

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>

<style scoped>
.global-styles {
  /* Your global styles will be applied to this component */
}
</style>
