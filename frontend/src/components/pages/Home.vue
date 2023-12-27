<script>
import ApiServices from "../../service/services";
import DisplayFamilyTree from "@/components/DisplayFamilyTree.vue";
import { checkAutho } from "../../service/checkAutho";

export default {
  components: {
    DisplayFamilyTree,
  },
  data: () => ({
    reveal: false,
    reveal1: false,
    reveal2: false,
    user: null,
    loading: false,

    // Control
    isOpenCreateDialog: false,
    isOpenDetailDialog: false,
    familyTreeId: "",

    // Search
    keyword: "",
    familyTrees: [],
    detailSelected: {},

    // Add
    name: "",
    nameRules: [(v) => !!v || "Name is required"],
    desc: "",
    descRules: [(v) => !!v || "Description is required"],
    ispublic: false,
  }),
  async mounted() {
    //how to add Authorisation
    try {
      const { loading, user } = await checkAutho();
      this.loading = loading;
      this.user = user;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    SuchenNachPerson() {
      this.$router.push("/SuchPerson");
    },
    openCreateDialog() {
      this.isOpenCreateDialog = true;
    },
    openDetailDialog() {
      this.isOpenDetailDialog = true;
    },
    closeDialog() {
      this.isOpenCreateDialog = false;
      this.isOpenDetailDialog = false;
    },
    searchFamilyTree() {
      if (this.keyword) {
        ApiServices.searchFamilyTree(this.keyword)
          .then((res) => {
            if (!res.data) return;
            this.familyTrees = res.data;
          })
          .catch((err) => {
            console.log(err);
            this.familyTrees = [];
          })
          .finally(() => {});
      } else {
        ApiServices.searchAllFamilyTree()
          .then((res) => {
            if (!res.data) return;
            this.familyTrees = res.data;
          })
          .catch((err) => {
            console.log(err);
            this.familyTrees = [];
          })
          .finally(() => {});
      }
    },
    async createFamilyTree() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        ApiServices.createFamilyTree({
          name: this.name,
          userID: 1,
          description: this.desc,
          ispublic: this.ispublic,
        })
          .then((res) => {
            console.log(res);
            this.searchFamilyTree();
            this.isOpenCreateDialog = false;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid) alert("Form is valid");
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    findUniqueTree(FamilyTreeID) {
      console.log("FamilyTreeID", FamilyTreeID);
      ApiServices.getFamilyTreeById(FamilyTreeID)
        .then((res) => {
          console.log("fffffffffffffff", res);
          if (!res.data) return;
          this.detailSelected = res.data;
          console.log("detailSelected", this.detailSelected);
          this.openDetailDialog();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<!-- Text mittig setzen-Zeile 27: class="d-flex align-center text-center bg-shades-white"  -->
<template>
  <div>
    <v-progress-circular
      v-if="loading"
      indeterminate
      ::size="75"
      :width="8"
    ></v-progress-circular>
    <!-- Progressbar falls den User authentifizieren lange lädt -->
    <v-row no-gutters v-if="user">
      <!-- Wenn der User authentifiziert ist, wird der Inhalt angezeigt kannst mit v-if="!user" auch etwas anzeigen wenn der User nicht angemeldet ist -->
      <v-col cols="12" class="search-tree-wrapper">
        <v-container>
          <div
            class="search-tree-content"
            style="height: calc(100vh - 64px - 48px)"
          >
            <!-- 16px is padding of v-container -->
            <h1>Explore your family tree now!</h1>
            <h2>Search for a specific family tree</h2>
            <div class="search-box">
              <input placeholder="Search Family Tree" v-model="keyword" />
              <button @click="searchFamilyTree">Search</button>
            </div>
            <div class="search-tree-results">
              <div class="search-tree-item create" @click="openCreateDialog">
                <img src="/images/create-icon.png" alt="create" />
              </div>
              <div
                v-for="tree in familyTrees"
                :key="tree.FamilyTreeID"
                class="search-tree-item"
              >
                <h4>Tree Name: {{ tree.Name }}</h4>
                <div class="button-wrap">
                  <button @click="findUniqueTree(tree.FamilyTreeID)">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </v-container>
      </v-col>
    </v-row>

    <v-dialog v-model="isOpenCreateDialog" max-width="50%">
      <v-card>
        <v-card-title> Create Family Tree </v-card-title>
        <v-sheet width="300" class="mx-auto">
          <v-form ref="form">
            <v-text-field
              v-model="name"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="desc"
              :rules="descRules"
              label="Description"
              required
            ></v-text-field>

            <v-checkbox v-model="ispublic" label="Public"></v-checkbox>
          </v-form>
        </v-sheet>
        <v-card-actions style="display: flex; justify-content: end">
          <v-btn @click="closeDialog">Close</v-btn>
          <v-btn variant="elevated" @click="createFamilyTree">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isOpenDetailDialog" max-width="100%">
      <v-card>
        <v-card-title> Family Tree : {{ detailSelected.Name }} </v-card-title>

        <v-card-item style="min-height: 50vh">
          <v-row no-gutters>
            <v-col cols="6" class="description">
              Description : {{ detailSelected.Describtion }}
            </v-col>
            <v-col cols="6" class="show-nodes">
              <DisplayFamilyTree FamilyTreeId="5" DisplaySize="50vh" />
            </v-col>
          </v-row>
        </v-card-item>
        <v-card-actions style="display: flex; justify-content: end">
          <v-btn @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <h1 class="pa-md-15 mx-lg-auto text-center">How to</h1>

  <v-container>
    <v-row align="center" justify="center">
      <v-card class="mx-auto" max-width="344" variant="outlined">
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
.search-tree-wrapper {
  /* background-image: url(/images/Bild1.jpg); */
  background: linear-gradient(
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0.6)
    ),
    url(/images/Bild1.jpg);
  background-size: cover;
  background-position: center;
  position: relative;
}

.search-tree-content {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 10px;
  padding: 10px;
}

.search-box {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.search-tree-content .search-box input {
  width: 70%;
  border: solid 2px gray;
  border-radius: 30px;
  background: white;
  padding: 10px 20px;
}

.search-tree-content .search-box button {
  border: solid 2px gray;
  border-radius: 30px;
  background: white;
  padding: 10px 20px;
}

.search-tree-results {
  height: 100%;
  display: flex;
  gap: 20px;
  margin: 40px 0px 20px 0;
  flex-wrap: wrap;
  justify-content: start;
  overflow: auto;
}

/* Target the entire scrollbar */
::-webkit-scrollbar {
  width: 6px; /* Set the width of the scrollbar */
}

/* Handle on hover */
::-webkit-scrollbar:hover {
  background: #f1f1f1; /* Background color on hover */
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; /* Color of the track */
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; /* Color of the thumb */
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; /* Color of the thumb on hover */
}
.search-tree-item {
  width: 200px;
  height: 180px;
  border-radius: 20px;
  border: solid 2px gray;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 15px;
  padding: 20px 0;
}

.search-tree-item.create {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='20' ry='20' stroke='black' stroke-width='5' stroke-dasharray='14' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
  border-radius: 20px;
  border: none;
  cursor: pointer;
}

.search-tree-item.create img {
  margin: auto;
  width: 50%;
  height: auto;
}

.search-tree-item h4 {
}

.search-tree-item button {
  width: 50%;
  color: white;
  background-color: #888;
  padding: 5px 20px;
  border: solid #555 2px;
  border-radius: 30px;
}

.detail-tree {
  display: flex;
  .description {
    max-width: 50%;
    text-align: center;
  }
  .show-nodes {
    max-width: 50%;
  }
}

@media (max-width: 960px) {
  .search-tree-wrapper {
    margin-top: 16px;
  }
}
</style>
