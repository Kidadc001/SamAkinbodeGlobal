<template>
  <div>
    <!-- Responsive Navbar -->
    <nav class="admin-navbar">
      <ul class="py-2">
        <li class="d-none d-lg-block bookvault-title">
          <i class="fas fa-book-reader me-2"></i>BookVault
        </li>
        <li v-for="item in sidebarItems" :key="item.tab" @click="changeTab(item.tab)">
          <button :class="{ active: adminTab === item.tab }" class="nav-btn" :disabled="loadingTab === item.tab">
            <i :class="item.icon"></i>
            <span class="nav-label">{{ item.label }}</span>
          </button>
        </li>
        <li>
          <button class="nav-btn" :class="{ active: adminTab === 'profile' }" @click="changeTab('profile')"
            :disabled="loadingTab === 'profile'">
            <i class="fas fa-user-shield"></i>
            <span class="nav-label">Admin</span>
          </button>
        </li>
      </ul>
    </nav>

    <div class="container-fluid conc pt-4">
      <section class="displayAside">
        <!-- Overview -->
        <div v-if="adminTab === 'overview'">
          <h4>Welcome {{ adminProfile.name }}!</h4>
          <div class="row mt-4">
            <div class="col-6 col-md-3 mb-3" v-for="stat in overviewStats" :key="stat.label">
              <div class="card text-center">
                <div class="card-body">
                  <i :class="stat.icon" :style="{ color: stat.color }" class="fa-2x mb-2"></i>
                  <h5 class="card-title">{{ stat.value }}</h5>
                  <p class="card-text">{{ stat.label }}</p>
                </div>
              </div>
            </div>
          </div>
          <hr>
          <h5>Recent Activities</h5>
          <ul class="list-group" style="overflow-y: scroll; height: 230px;">
            <li class="list-group-item" v-for="(activity, idx) in recentActivities" :key="idx">
              {{ activity }}
            </li>
            <li v-if="recentActivities.length === 0" class="list-group-item text-muted">No recent activities.</li>
          </ul>
        </div>

        <!-- Books -->
        <div v-else-if="adminTab === 'books'">
          <!-- ...existing book management code... -->
        </div>

        <!-- Users -->
        <div v-else-if="adminTab === 'users'">
          <h4>All Users</h4>
          <div v-if="users.length === 0" class="alert alert-info">No users found.</div>
          <div class="table-responsive" v-else>
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Borrowed</th>
                  <th>Bought</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.firstName }} {{ user.lastName }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.role }}</td>
                  <td>{{ Array.isArray(user.borrowedBooks) ? user.borrowedBooks.length : 0 }}</td>
                  <td>{{ Array.isArray(user.broughtBooks) ? user.broughtBooks.length : 0 }}</td>
                  <td>
                    <button class="btn btn-info btn-sm" @click="selectUser(user)">View Details</button>
                    <button class="btn btn-danger btn-sm ms-2" @click="deleteUser(user.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- User Modal -->
          <div v-if="selectedUser" class="custom-modal-backdrop" @click.self="selectedUser = null">
            <div class="custom-modal">
              <div class="modal-header">
                <h5 class="modal-title">User Details</h5>
                <button type="button" class="btn-close" @click="selectedUser = null"></button>
              </div>
              <div class="modal-body">
                <h6>User Info</h6>
                <p><strong>Name:</strong> {{ selectedUser.firstName }} {{ selectedUser.lastName }}</p>
                <p><strong>Email:</strong> {{ selectedUser.email }}</p>
                <p><strong>Role:</strong> {{ selectedUser.role }}</p>

                <h6>Total Borrowed Books: {{ Array.isArray(selectedUser.borrowedBooks) ? selectedUser.borrowedBooks.length : 0 }}</h6>
                <ul>
                  <li v-for="book in selectedUser.borrowedBooks || []" :key="book.id">
                    {{ book.title }} by {{ book.author }}
                  </li>
                  <li v-if="!selectedUser.borrowedBooks || selectedUser.borrowedBooks.length === 0">None</li>
                </ul>

                <h6>Total Bought Books: {{ Array.isArray(selectedUser.broughtBooks) ? selectedUser.broughtBooks.length : 0 }}</h6>
                <ul>
                  <li v-for="book in selectedUser.broughtBooks || []" :key="book.id">
                    {{ book.title }} by {{ book.author }}
                  </li>
                  <li v-if="!selectedUser.broughtBooks || selectedUser.broughtBooks.length === 0">None</li>
                </ul>

                <h6>Appointments</h6>
                <ul>
                  <li v-for="app in (selectedUser.appointments || [])" :key="app.date + '-' + app.subject">
                    {{ app.subject }} - {{ app.details }} ({{ app.date }})
                  </li>
                  <li v-if="!selectedUser.appointments || selectedUser.appointments.length === 0">No appointments.</li>
                </ul>

                <h6>Transactions</h6>
                <ul>
                  <li v-for="tx in (selectedUser.transactionHistory || [])" :key="tx.reference">
                    {{ tx.type }}: {{ tx.title }} - ₦{{ tx.price || tx.rent }} ({{ tx.date }}) Ref: {{ tx.reference }}
                  </li>
                  <li v-if="!selectedUser.transactionHistory || selectedUser.transactionHistory.length === 0">No transactions.</li>
                </ul>

                <h6>User Comments</h6>
                <ul>
                  <li v-for="c in selectedUser.comments || []" :key="c.id || (c.bookTitle || '') + (c.date || '')">
                    <strong>{{ selectedUser.firstName }}:</strong> {{ c.text || c.comment }} <span class="text-muted small">({{ c.date }})</span>
                  </li>
                  <li v-if="!selectedUser.comments || selectedUser.comments.length === 0">No comments.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!-- ...rest of your code remains unchanged... -->
        <!-- Appointments, Transactions, Admin Profile, etc. -->
      </section>
    </div>
  </div>
  <footer class="text-white text-center  footer" style="background-color: #2c3e50; padding: 40px 0px; ">
    <div class="container">
      <p class="mb-0">© 2025 Library Management System. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
import mockstorage from "@/stores/mockstorage";
import bookstore from "@/stores/booksstore";

export default {
  data() {
    return {
      adminTab: "overview",
      profileTab: "details",
      sidebarItems: [
        { tab: "overview", label: "Home", icon: "fas fa-chart-bar" },
        { tab: "books", label: "Books", icon: "fas fa-book" },
        { tab: "users", label: "Users", icon: "fas fa-users" },
        { tab: "appointments", label: "Appointments", icon: "fas fa-calendar-alt" },
        { tab: "transactions", label: "Transactions", icon: "fas fa-receipt" }
      ],
      books: [],
      users: [],
      appointments: [],
      transactions: [],
      comments: [],
      bookForm: {
        id: "",
        title: "",
        author: "",
        price: "",
        rent: "",
        image: "",
        description: "",
        pdfUrl: "",
        dateAdded: ""
      },
      adminProfile: {
        name: "Akinbode",
        email: "otulajafavour@gmail.com"
      },
      selectedUser: null,
      showBookModal: false,
      modalMode: "add",
      bookFormLoading: false,
      profileLoading: false,
      loadingTab: "",
      bookSearch: "",
      bookDateFilter: "",
      appointmentDateFilter: "",
      transactionDateFilter: "",
      commentDateFilter: ""
    };
  },
  computed: {
    overviewStats() {
      return [
        { label: "Total Books", value: this.books.length, icon: "fas fa-book", color: "#0d6efd" },
        { label: "Total Users", value: this.users.length, icon: "fas fa-users", color: "#198754" },
        { label: "Total Appointments", value: this.allAppointments.length, icon: "fas fa-calendar-alt", color: "#ffc107" },
        { label: "Total Transactions", value: this.allTransactions.length, icon: "fas fa-receipt", color: "#0dcaf0" }
      ];
    },
    allAppointments() {
      let all = [];
      this.users.forEach(u => {
        if (Array.isArray(u.appointments)) {
          all = all.concat(u.appointments.map(a => ({ ...a, userId: u.id })));
        }
      });
      return all;
    },
    allTransactions() {
      let all = [];
      this.users.forEach(u => {
        if (Array.isArray(u.transactionHistory)) {
          all = all.concat(u.transactionHistory.map(t => ({ ...t, userId: u.id })));
        }
      });
      return all;
    },
    filteredBooks() {
      let books = this.books;
      if (this.bookSearch) {
        books = books.filter(b => b.title.toLowerCase().includes(this.bookSearch.toLowerCase()));
      }
      if (this.bookDateFilter) {
        books = books.filter(b => b.dateAdded && b.dateAdded.startsWith(this.bookDateFilter));
      }
      return books.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    },
    filteredTransactions() {
      let txs = this.allTransactions;
      if (this.transactionDateFilter) {
        txs = txs.filter(t => t.date && t.date.startsWith(this.transactionDateFilter));
      }
      return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    filteredAppointments() {
      let apps = this.allAppointments;
      if (this.appointmentDateFilter) {
        apps = apps.filter(a => a.date && a.date.startsWith(this.appointmentDateFilter));
      }
      return apps.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    filteredComments() {
      let comments = this.comments;
      if (this.commentDateFilter) {
        comments = comments.filter(c => c.date && c.date.startsWith(this.commentDateFilter));
      }
      return comments.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    recentActivities() {
      let activities = [];
      this.allTransactions.forEach(tx => {
        activities.push({
          type: "Transaction",
          detail: `${tx.type} - ${tx.title} (₦${tx.price || tx.rent}) by ${this.getUser(tx.userId)?.firstName || tx.userId}`,
          date: tx.date
        });
      });
      this.allAppointments.forEach(app => {
        activities.push({
          type: "Appointment",
          detail: `${app.subject} by ${this.getUser(app.userId)?.firstName || app.userId}`,
          date: app.date
        });
      });
      activities.sort((a, b) => new Date(b.date) - new Date(a.date));
      return activities.slice(0, 5).map(a => `[${a.type}] ${a.detail} (${a.date})`);
    }
  },
  async mounted() {
    await this.fetchAllData();
    const saved = localStorage.getItem('adminProfile');
    if (saved) {
      this.adminProfile = JSON.parse(saved);
    }
  },
  methods: {
    wordCount(text) {
      if (!text) return 0;
      return text.trim().split(/\s+/).length;
    },
    async fetchAllData() {
      this.books = await bookstore.fetchAllBooks();
      this.users = (await mockstorage.fetchUsers()).map(u => ({
        ...u,
        borrowedBooks: Array.isArray(u.borrowedBooks) ? u.borrowedBooks : [],
        broughtBooks: Array.isArray(u.broughtBooks) ? u.broughtBooks : [],
        appointments: Array.isArray(u.appointments) ? u.appointments : [],
        transactionHistory: Array.isArray(u.transactionHistory) ? u.transactionHistory : [],
        comments: Array.isArray(u.comments) ? u.comments : []
      }));
      this.appointments = await mockstorage.fetchAllAppointments();
      this.transactions = await mockstorage.fetchAllTransactions();
      this.comments = await mockstorage.fetchAllComments ? await mockstorage.fetchAllComments() : [];
    },
    changeTab(tab) {
      if (this.loadingTab) return;
      this.loadingTab = tab;
      setTimeout(() => {
        this.adminTab = tab;
        this.loadingTab = "";
      }, 400);
    },
    openBookModal(mode, book = null) {
      this.modalMode = mode;
      if (mode === "edit" && book) {
        this.bookForm = { ...book };
      } else {
        this.resetBookForm();
      }
      this.showBookModal = true;
    },
    closeBookModal() {
      this.showBookModal = false;
      this.resetBookForm();
      this.bookFormLoading = false;
    },
    async handleImageUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        this.showToast("Only image files are allowed.", true);
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.bookForm.image = evt.target.result;
        this.showToast("Image uploaded successfully!", false);
      };
      reader.onerror = () => {
        this.showToast("Failed to read image file.", true);
      };
      reader.readAsDataURL(file);
    },
    async addOrUpdateBook() {
      this.bookFormLoading = true;
      try {
        this.bookForm.price = Number(this.bookForm.price) || 0;
        this.bookForm.rent = Number(this.bookForm.rent) || 0;
        this.bookForm.dateAdded = new Date().toISOString().slice(0, 10);
        if (this.wordCount(this.bookForm.description) > 400) {
          this.showToast("Description must not exceed 400 words.", true);
          this.bookFormLoading = false;
          return;
        }
        if (!this.bookForm.pdfUrl.startsWith("http")) {
          this.showToast("Please provide a valid file URL.", true);
          this.bookFormLoading = false;
          return;
        }
        if (!this.bookForm.image) {
          this.showToast("Please upload a cover image.", true);
          this.bookFormLoading = false;
          return;
        }
        if (this.modalMode === "edit" && this.bookForm.id) {
          await bookstore.updateBook(this.bookForm.id, this.bookForm);
          this.showToast("Book updated successfully!");
        } else {
          await bookstore.addBook(this.bookForm);
          this.showToast("Book added successfully!");
        }
        await this.fetchAllData();
        this.closeBookModal();
      } catch (e) {
        this.showToast("Failed to save book!", true);
      } finally {
        this.bookFormLoading = false;
      }
    },
    editBook(book) {
      this.openBookModal("edit", book);
    },
    async deleteBook(bookId) {
      if (confirm("Are you sure you want to delete this book?")) {
        this.bookFormLoading = true;
        try {
          await bookstore.deleteBook(bookId);
          await this.fetchAllData();
          this.showToast("Book deleted successfully!", false);
        } catch (e) {
          this.showToast("Failed to delete book!", true);
        } finally {
          this.bookFormLoading = false;
        }
      }
    },
    resetBookForm() {
      this.bookForm = {
        id: "",
        title: "",
        author: "",
        price: "",
        rent: "",
        image: "",
        description: "",
        pdfUrl: "",
        dateAdded: ""
      };
    },
    logout() {
      this.$router.push('/');
    },
    getUser(userId) {
      return this.users.find(u => u.id === userId);
    },
    selectUser(user) {
      this.selectedUser = user;
    },
    async deleteUser(userId) {
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          await mockstorage.deleteUser(userId);
          this.users = this.users.filter(u => u.id !== userId);
          this.showToast("User deleted successfully!");
        } catch (e) {
          this.showToast("Failed to delete user!", true);
        }
      }
    },
    async saveAdminProfile() {
      this.profileLoading = true;
      try {
        localStorage.setItem('adminProfile', JSON.stringify(this.adminProfile));
        this.showToast('Admin profile updated!');
        this.profileTab = 'details';
      } catch {
        this.showToast('Failed to update profile', true);
      } finally {
        this.profileLoading = false;
      }
    },
    showToast(message, error = false) {
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.position = 'fixed';
      toast.style.top = '20px';
      toast.style.right = '30px';
      toast.style.background = error ? '#dc3545' : '#28a745';
      toast.style.color = '#fff';
      toast.style.padding = '12px 24px';
      toast.style.borderRadius = '6px';
      toast.style.zIndex = 9999;
      toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 2000);
    }
  }
};
</script>



<style scoped>
.admin-navbar {
  background: #0d6efd;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1100;
}

.admin-navbar ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.admin-navbar li {
  flex: 1;
  text-align: center;
}

.bookvault-title {
  font-weight: bold;
  font-size: 1.2rem;
  color: #fff;
  padding: 12px 0;
}

textarea {
  height: 90px;
  resize: none;
  overflow-y: scroll;
}

@media (max-width: 991px) {
  .bookvault-title {
    display: none !important;
  }
}

.nav-btn {
  background: none;
  border: none;
  color: #fff;
  padding: 12px 0 2px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.1rem;
  transition: background 0.2s;
  position: relative;
}

.nav-btn.active,
.nav-btn:focus {
  background: #084298;
  color: #fff;
}

.nav-label {
  display: block;
  font-size: 0.95rem;
  margin-top: 2px;
  color: #fff;
  font-weight: 500;
}

@media (max-width: 900px) {
  .admin-navbar {
    position: fixed;
    bottom: 0;
    top: auto;
    width: 100vw;
    border-top: 1px solid #e0e0e0;
    padding: 0;
  }

  .container-fluid.conc {
    padding-bottom: 60px;
  }
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1040;
  width: 100%;
}

.modal {
  overflow-y: scroll;
  margin: 40px 0px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.custom-modal-backdrop {
  position: fixed;
  top: 10px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1050;
}

.custom-modal {
  background: #fff;
  border-radius: 8px;
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
}

.profile-navbar {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
}

@media screen and (max-width:900px) {
  .nav-label {
    display: none;

  }

  .admin-navbar li i {
    padding: 10px 0px;
  }


  .modal {
    overflow: scroll;
    padding: 300px 0px;
    margin: 10px 0px;
    position: unset;
  }

  .modal-backdrop {
    overflow-y: scroll;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1040;
    width: 100%;
  }

}
</style>