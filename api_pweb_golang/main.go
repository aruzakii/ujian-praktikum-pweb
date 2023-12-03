package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"simpel-app-auth/auth"
	"simpel-app-auth/middleware"
	"simpel-app-auth/models"
	_ "simpel-app-auth/models"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/joho/godotenv"

	"crypto/sha256"
	_ "crypto/sha256"
	"encoding/hex"
	_ "encoding/hex"

	"github.com/gin-contrib/cors"
	_ "github.com/lib/pq"
)

// type GormStudent struct {
// 	Stud_id       uint64 `json:"stud_id" gorm:"AUTO_INCREMENT"`
// 	Stud_name     string `json:"stud_name" binding:"required"`
// 	Stud_age      uint64 `json:"stud_age" binding:"required"`
// 	Stud_address  string `json:"stud_address" binding:"required"`
// 	Stud_phonenum string `json:"stud_phonenum" binding:"required"`
// }

// type User struct {
// 	ID       uint   `gorm:"primaryKey" json:"id"`
// 	Username string `json:"username" binding:"required"`
// 	Password string `json:"password" binding:"required"`
// }

func postHandler(ctx *gin.Context, db *gorm.DB) {
	var data models.GormItem
	if ctx.Bind(&data) == nil { //data yang dikirim saat http tidak kosong
		db.Create(&data)
		ctx.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"massage": "succes created",
			"data":    data,
		})
		return
	}
	ctx.JSON(http.StatusBadRequest, gin.H{
		"massage": "error",
	})

}

func getHandler(ctx *gin.Context, db *gorm.DB) {

	//dengan gorm
	var data models.GormItem

	itemId := ctx.Param("item_id")
	// id, _ := strconv.ParseUint(studId, 10, 64)

	// data := models.GormItem{Stud_id: id}
	// Dalam contoh di atas, data akan memiliki nilai yang sama dengan nilai id
	if db.Find(&data, "item_id=?", itemId).RecordNotFound() {
		ctx.JSON(http.StatusNotFound, gin.H{
			"massage": "data not found",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   data, //karena variabel data ini telah memiliki nilai baru setelah di prosen oleh find()
	})

}

func getAllHandler(ctx *gin.Context, db *gorm.DB) {
	//Getallstudent Dengan Gorm

	var data []models.GormItem
	//kenapa harus pakai &data karena untuk daat fungsi find dijalankan dia bisa memproses dan merubah nilai
	//di variabel data diatasnya
	db.Find(&data) //untuk mencari /men get semua data yang ada di tabel di database
	ctx.JSON(http.StatusOK, gin.H{
		"status": "ok",
		"data":   data,
	})

}

func putHandler(c *gin.Context, db *gorm.DB) {

	//dengan gorm
	var data models.GormItem

	itemId := c.Param("item_id")

	if db.Find(&data, "item_id=?", itemId).RecordNotFound() {
		c.JSON(http.StatusNotFound, gin.H{
			"massage": "tidak ada data dengan id :" + itemId,
		})
		return
	}

	reqStud := data

	if c.Bind(&reqStud) == nil { //jika nill artinya proses biding berhasil
		db.Model(&data).Where("item_id=?", itemId).Update(reqStud)
		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"data":    data,
			"massage": "data berhasil di update",
		})
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{
		"massage": "error gagal binding",
	})

}

func delHandler(c *gin.Context, db *gorm.DB) {

	var data models.GormItem
	itemID := c.Param("item_id")

	db.Delete(&data, "item_id=?", itemID)
	c.JSON(http.StatusOK, gin.H{
		"massage": "delete sucess",
	})
}

func setupRouter() *gin.Engine {
	errEnv := godotenv.Load(".env")

	if errEnv != nil {
		log.Fatal("Error load env")

	}
	conn := os.Getenv("POSTGRES_URL")
	db, err := gorm.Open("postgres", conn)

	if err != nil {
		log.Fatal(err)

	}
	Migrate(db)

	r := gin.Default()

	// Set up CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"} // Ganti sesuai dengan alamat React aplikasi Anda
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	config.AllowHeaders = []string{"Authorization", "Content-Type"}
	r.Use(cors.New(config))

	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "succes",
		})
	})

	r.POST("/register", func(ctx *gin.Context) {
		auth.RegisterHandlerr(ctx, db)
	})

	r.POST("/login", func(ctx *gin.Context) {
		auth.LoginHandler(ctx, db)
	})

	v1 := r.Group("v1")

	v1.POST("/item", middleware.AuthValidate, func(ctx *gin.Context) {
		postHandler(ctx, db)
	})

	v1.GET("/item", middleware.AuthValidate, func(ctx *gin.Context) {
		getAllHandler(ctx, db)
	})

	v1.GET("/item/:item_id", middleware.AuthValidate, func(ctx *gin.Context) {
		getHandler(ctx, db)
	})

	v1.PUT("/item/:item_id", middleware.AuthValidate, func(ctx *gin.Context) {
		putHandler(ctx, db)
	})
	v1.DELETE("/item/:item_id", middleware.AuthValidate, func(ctx *gin.Context) {
		delHandler(ctx, db)
	})

	return r
}

func main() {
	r := setupRouter()

	r.Run(":8080")

}

func Migrate(DB *gorm.DB) {
	DB.AutoMigrate(&models.GormItem{})

	data := models.GormItem{}
	if DB.Find(&data).RecordNotFound() {
		fmt.Println("=============run seeder item ==================")
		seederStudent(DB)
	}

	DB.AutoMigrate(&models.User{})
	// Seeder for User
	user := models.User{}

	if DB.Find(&user).RecordNotFound() {
		fmt.Println("=============run seeder user ==================")
		seederUser(DB)
	}

}

func sha256Hash(input string) string {
	hasher := sha256.New()
	hasher.Write([]byte(input))
	hashInBytes := hasher.Sum(nil)
	hashString := hex.EncodeToString(hashInBytes)
	return hashString
}

func seederUser(DB *gorm.DB) {
	password := "cungkring"
	hashedPassword := sha256Hash(password)
	user := models.User{
		Username: "admin",
		Password: hashedPassword,
	}
	DB.Create(&user)

}

func seederStudent(DB *gorm.DB) {
	data := models.GormItem{
		Item_name:       "ssd sandisk",
		Item_stok:       20,
		Item_price:      100000,
		Item_date_entry: "06/01/2003",
	}

	DB.Create(&data)

}

// Penjelasan Kode:

// Kita mengimpor pustaka-pustaka yang diperlukan seperti github.com/gin-gonic/gin untuk framework Gin, github.com/jinzhu/gorm untuk ORM GORM, dan _ "github.com/lib/pq" untuk driver PostgreSQL.

// Kami mendefinisikan struktur data models.GormItem yang mencerminkan entitas mahasiswa dengan atribut-atribut seperti stud_id, stud_name, stud_age, stud_address, dan stud_phonenum.

// Fungsi main adalah fungsi utama yang menjalankan aplikasi dan mengatur server web untuk mendengarkan pada port 8080.

// Fungsi setupRouter digunakan untuk mengonfigurasi router HTTP menggunakan Gin. Ini mendefinisikan rute-rute yang digunakan untuk menangani permintaan HTTP seperti POST, GET, PUT, dan DELETE.

// Fungsi Migrate digunakan untuk melakukan migrasi otomatis tabel ke database PostgreSQL dan menambahkan data awal jika tidak ada data mahasiswa dalam database.

// Fungsi seederUser digunakan untuk menambahkan data awal (seeder) ke dalam database. Dalam contoh ini, satu data mahasiswa ditambahkan.

// Fungsi postHandler menangani permintaan POST untuk menambahkan data mahasiswa baru ke dalam database.

// Fungsi getHandler menangani permintaan GET untuk mendapatkan data mahasiswa berdasarkan stud_id yang diberikan sebagai bagian dari URL.

// Fungsi getAllHandler menangani permintaan GET untuk mendapatkan semua data mahasiswa dari database.

// Fungsi putHandler menangani permintaan PUT untuk memperbarui data mahasiswa berdasarkan stud_id yang diberikan sebagai bagian dari URL.

// Fungsi delHandler menangani permintaan DELETE untuk menghapus data mahasiswa berdasarkan stud_id yang diberikan sebagai bagian dari URL.

// Catatan Penting:
// Pastikan Anda sudah memiliki PostgreSQL yang dijalankan dengan benar dan telah mengonfigurasi sesuai dengan koneksi yang Anda tentukan. Selain itu, pastikan semua pustaka yang digunakan telah diinstal.

// Dengan
