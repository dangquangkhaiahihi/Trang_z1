<script>
import ApiServices from "../../service/services";
import DisplayFamilyTree from "@/components/DisplayFamilyTree.vue";
import { checkAutho } from "../../service/checkAutho";
import { authenStore } from "@/store/authen.store";
import addPersons from "@/components/addPersons.vue";
import relationships from "@/components/Relationships.vue";

export default {
  computed: {
    authenStore() {
      return authenStore;
    },
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Create FamilyTree ";
        case 2:
          return "Add Persons ";
        case 3:
          return "Add Relationships ";
        default:
          return "Glückwunsch! Dein Familienstammbaum wurde erstellt ";
      }
    },
  },
  components: {
    DisplayFamilyTree,
    addPersons,
    relationships,
  },
  data: () => ({
    reveal: false,
    reveal1: false,
    reveal2: false,
    user: null,
    loading: false,
    shouldReloadFamilyTree: false,
    familyTreeId: null,
    creatingFamilyTreeFailed: false,

    // Control
    isOpenCreateDialog: false,
    isOpenDetailDialog: false,
    isOpenRequestDialog: false,
    isOpenErrorDialog: false,
    errorMessage: "",
    familyTreeId: "",
    step: 1,

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
    handleReloadFamilyTree(value) {
      this.shouldReloadFamilyTree = !this.shouldReloadFamilyTree;
      console.log(this.shouldReloadFamilyTree);
    },
    getMaxWidth() {
      if (this.step === 3) {
        return "65%"; // Max width for the last step
      } else {
        return "50%"; // Max width for the first two steps
      }
    },
    SuchenNachPerson() {
      this.$router.push("/SuchPerson");
    },
    openCreateDialog() {
      this.isOpenCreateDialog = true;
    },
    openDetailDialog() {
      this.isOpenDetailDialog = true;
    },
    openRequestDialog(FamilyTreeID) {
      this.familyTreeId = FamilyTreeID;
      this.isOpenRequestDialog = true;
    },
    closeErrorDialog() {
      this.errorMessage = "";
      this.isOpenErrorDialog = false;
    },
    closeDialog() {
      this.isOpenCreateDialog = false;
      this.isOpenDetailDialog = false;
      this.isOpenRequestDialog = false;
    },
    openErrorDialog(mess) {
      this.errorMessage = mess;
      this.isOpenErrorDialog = true;
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
          userID: authenStore.user?.id,
          description: this.desc,
          ispublic: this.ispublic,
        })
          .then((res) => {
            console.log(res, "res");
            this.familyTreeId = res.data.FamilyTreeID;
            this.step++;
          })
          .catch((err) => {
            console.log(err);
            this.creatingFamilyTreeFailed = true;
            if (err.response.status == "401") {
              // TO DO : Show noti or something
            }
          });
      }
    },
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid) alert("Form is valid");
    },
    findUniqueTree(FamilyTreeID) {
      console.log("FamilyTreeID", FamilyTreeID);
      ApiServices.getFamilyTreeById(FamilyTreeID)
        .then((res) => {
          if (!res.data) return;
          this.detailSelected = res.data;
          console.log("detailSelected", this.detailSelected);
          this.openDetailDialog();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    requestJoinTree() {
      ApiServices.requestJoinTree({
        familyTreeId: this.familyTreeId,
        userId: authenStore.user?.id,
      })
        .then((res) => {
          console.log("resssss", res);
        })
        .catch((err) => {
          console.log(err);
          this.openErrorDialog(err.response.data.message);
        })
        .finally(() => {
          this.closeDialog();
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
    <v-row no-gutters>
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
              <v-text-field
                color="third"
                variant="underlined"
                placeholder="Suche Familienstammbaum"
                v-model="keyword"
                :style="rounded"
              />
              <v-btn class="mt-2" variant="outlined" @click="searchFamilyTree"
                >Suche</v-btn
              >
            </div>
            <div class="search-tree-results">
              <div class="search-tree-item create" @click="openCreateDialog">
                <img src="/images/create-icon.png" alt="create" />
              </div>
              <v-card
                variant="outlined"
                v-for="tree in familyTrees"
                :key="tree.FamilyTreeID"
                class="search-tree-item"
              >
                <h4>Stammbaum Name: {{ tree.Name }}</h4>
                <div class="buttons-wrap">
                  <v-btn
                    v-if="authenStore.user?.id !== tree.OwnerUserID"
                    @click="openRequestDialog(tree.FamilyTreeID)"
                  >
                    Join
                  </v-btn>
                  <v-btn @click="findUniqueTree(tree.FamilyTreeID)">
                    View
                  </v-btn>
                </div>
              </v-card>
            </div>
          </div>
        </v-container>
      </v-col>
    </v-row>

    <v-dialog
      v-model="isOpenCreateDialog"
      :style="{ 'max-width': getMaxWidth() }"
    >
      <v-card>
        <v-card-title
          class="text-h6 font-weight-regular text-center mx-auto justify-space-between mb-3 mt-3"
        >
          <span>{{ currentTitle }}</span>
          <v-avatar
            v-if="step < 3"
            color="primary"
            size="24"
            v-text="step"
          ></v-avatar>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-scroll-y>
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-card>
                <div v-if="authenStore.loggedIn">
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

                      <v-checkbox
                        v-model="ispublic"
                        label="Public"
                      ></v-checkbox>
                    </v-form>
                  </v-sheet>
                  <v-row v-if="loginFailed" class="mt-2">
                    <v-col>
                      <v-alert type="error">
                        Stammbaum erstellung fehlgeschlagen.
                      </v-alert>
                    </v-col>
                  </v-row>
                </div>

                <div v-else>
                  <v-sheet width="300" class="mx-auto">
                    You have to log in to Create Family Tree
                  </v-sheet>
                </div>

                <v-card-actions style="display: flex; justify-content: end">
                  <v-btn @click="closeDialog">Close</v-btn>
                  <v-btn variant="elevated" @click="createFamilyTree"
                    >Create</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-window-item>

            <v-window-item :value="2">
              <addPersons
                :FamilyTreeId="this.familyTreeId"
                :ReloadFamilyTree="this.shouldReloadFamilyTree"
              />
            </v-window-item>
            <v-window-item :value="3">
              <relationships :FamilyTreeId="this.familyTreeId" />
            </v-window-item>
            <v-window-item :value="4">
              <v-card>
                <v-alert type="success">
                  Gehe zu deinem Stammbaum, um die Ergebnisse zu sehen
                </v-alert>
                <v-card-text>
                  <v-btn
                    color="primary"
                    @click="this.$router.push('/chooseFamilyTree')"
                    >Go to Family Tree</v-btn
                  >
                </v-card-text>
                <v-card-actions style="display: flex; justify-content: end">
                  <v-btn @click="closeDialog">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-window-item>
          </v-window>
        </v-scroll-y>
        <!--   <v-divider></v-divider> -->

        <v-card-actions v-if="step > 1 && step < 4">
          <v-btn v-if="step > 1" variant="text" @click="step--"> Back </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="step > 1 && step < 4" variant="flat" @click="step++">
            Next
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isOpenDetailDialog" max-width="100%" max-height="80vh">
      <v-card height="80vh">
        <v-card-title> Family Tree : {{ detailSelected.Name }} </v-card-title>

        <v-card-item>
          <v-row no-gutters>
            <v-col cols="6" class="description">
              Description : {{ detailSelected.Describtion }}
              <relationships
                :FamilyTreeId="detailSelected.FamilyTreeID"
                v-if="authenStore.loggedIn"
                @reload-family-tree="handleReloadFamilyTree"
              />
            </v-col>
            <v-col
              cols="6"
              :class="{
                'show-nodes': authenStore.loggedIn,
                'hide-nodes': !authenStore.loggedIn,
              }"
            >
              <div class="hide-nodes-overlay" style="">
                You have to login to see Family Tree
              </div>
              <div style="height: 100vh">
                <DisplayFamilyTree
                  :FamilyTreeId="detailSelected.FamilyTreeID"
                  DisplaySize="60vh"
                  :ReloadFamilyTree="this.shouldReloadFamilyTree"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-item>
        <v-card-actions style="display: flex; justify-content: end">
          <v-btn @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isOpenRequestDialog" max-width="50%">
      <v-card>
        <v-card-title color=""> Join Family Tree </v-card-title>

        <div v-if="authenStore.loggedIn">
          <v-sheet width="300" class="mx-auto">
            <p>Do you want to join this FamilyTree?</p>
          </v-sheet>
        </div>
        <div v-else>
          <v-sheet width="300" class="mx-auto">
            You have to log in to Request to join Family Tree
          </v-sheet>
        </div>

        <v-card-actions style="display: flex; justify-content: end">
          <div v-if="authenStore.loggedIn">
            <v-btn @click="closeDialog">No</v-btn>
            <v-btn variant="elevated" @click="requestJoinTree">Yes</v-btn>
          </div>
          <div v-else>
            <v-btn @click="closeDialog">Close</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isOpenErrorDialog" max-width="50%">
      <v-card>
        <v-card-title> Error </v-card-title>

        <v-sheet width="300" class="mx-auto">
          <p>{{ this.errorMessage }}</p>
        </v-sheet>

        <v-card-actions style="display: flex; justify-content: end">
          <v-btn @click="closeErrorDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <h1 class="pa-md-15 mx-lg-auto text-center">How to</h1>

  <v-container class="mb-5">
    <v-row justify="center" align="center">
      <!-- Step 1 -->
      <v-col>
        <v-card class="mx-auto rounded-xl" max-width="344" variant="outlined">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Hinweis für Sie</div>
              <div class="text-h4 mb-4">Schritt 1</div>
              <div class="text-caption">
                <p>Stammbaum erstellen:</p>
                <ul>
                  <li>Drücken Sie auf das Plus-Symbol.</li>
                  <li>Geben Sie die Informationen ein.</li>
                  <li>Klicken Sie auf "Erstellen".</li>
                  <li>Klicken Sie auf "Weiter"</li>
                </ul>
              </div>
            </div>
          </v-card-item>
          <v-card-actions>
            <v-btn variant="text" @click="reveal = !reveal">
              {{ reveal ? "Schließen" : "Weiterlesen" }}
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <v-card v-if="reveal" class="v-card--reveal" style="height: 100%">
              <v-card-text class="pb-0">
                <p>
                  - Sie müssen eingeloggt sein, um einen Stammbaum zu erstellen.
                </p>
              </v-card-text>
            </v-card>
          </v-expand-transition>
        </v-card>
      </v-col>

      <!-- Step 2 -->
      <v-col>
        <v-card class="mx-auto rounded-xl" max-width="344" variant="outlined">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Hinweis für Sie</div>
              <div class="text-h4 mb-4">Schritt 2</div>
              <div class="text-caption">
                <p>Personen hinzufügen:</p>
                <ul>
                  <li>Geben Sie die Informationen ein.</li>
                  <li>Klicken Sie auf "Erstellen".</li>
                  <li>
                    Klicken Sie auf "Weiter", wenn alle Personen erstellt sind.
                  </li>
                </ul>
              </div>
            </div>
          </v-card-item>
          <v-card-actions>
            <v-btn variant="text" @click="reveal1 = !reveal1">
              {{ reveal1 ? "Schließen" : "Weiterlesen" }}
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <v-card v-if="reveal1" class="v-card--reveal" style="height: 100%">
              <v-card-text class="pb-0">
                <p></p>
              </v-card-text>
            </v-card>
          </v-expand-transition>
        </v-card>
      </v-col>

      <!-- Step 3 -->
      <v-col>
        <v-card class="mx-auto rounded-xl" max-width="344" variant="outlined">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Hinweis für Sie</div>
              <div class="text-h4 mb-4">Schritt 3</div>
              <div class="text-caption">
                <p>Beziehungen anlegen:</p>
                <ul>
                  <li>Wählen Sie die Person mit Kind-Beziehung aus.</li>
                  <li>
                    Klicken Sie auf das Elternteil und wählen Sie "Vater" oder
                    "Mutter".
                  </li>
                  <li>Klicken Sie auf "Zur Liste hinzufügen ".</li>
                </ul>
              </div>
            </div>
          </v-card-item>

          <v-card-actions>
            <v-btn variant="text" @click="reveal2 = !reveal2">
              {{ reveal2 ? "Schließen" : "Weiterlesen" }}
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <v-card v-if="reveal2" class="v-card--reveal" style="height: 100%">
              <v-card-text class="pb-0">
                <p>
                  - Rufen Sie Ihre Profilseite oder Stammbauminformationen auf.
                </p>
                <p>
                  - Sie müssen eingeloggt sein, um Beziehungen zu speichern.
                </p>
              </v-card-text>
            </v-card>
          </v-expand-transition>
        </v-card>
      </v-col>
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
  /* background: linear-gradient(
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.8)
  ),
  url(https://images.pexels.com/photos/3875160/pexels-photo-3875160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);
  */
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

.search-tree-item {
  width: 200px;
  height: 180px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 15px;
  padding: 20px 0;
}

.search-tree-item .buttons-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.search-tree-item.create {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='20' ry='20' stroke='grey' stroke-width='4' stroke-dasharray='14' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
  border-radius: 20px;
  border: none;
  cursor: pointer;
}

.search-tree-item.create img {
  margin: auto;
  width: 50%;
  height: auto;
}

.search-tree-item button {
  width: 50%;
  padding: 5px 20px;
  border-radius: 30px;
}

.description {
  text-align: left;
}
.show-nodes {
  max-width: 50%;
  overflow: auto;
  height: 64vh;
}

.show-nodes .hide-nodes-overlay {
  display: none;
}

.hide-nodes {
  max-height: 65vh;
  position: relative;
}
.hide-nodes .hide-nodes-overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  z-index: 999;
  text-align: center;
  padding: 30%;
}

@media (max-width: 960px) {
  .search-tree-wrapper {
    margin-top: 16px;
  }
}
</style>
