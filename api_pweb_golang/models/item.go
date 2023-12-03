package models

type GormItem struct {
	Item_id         uint64 `json:"item_id" gorm:"AUTO_INCREMENT"`
	Item_name       string `json:"item_name" binding:"required"`
	Item_stok       uint64 `json:"item_stok" binding:"required"`
	Item_price      uint64 `json:"item_price" binding:"required"`
	Item_date_entry string `json:"item_date_entry" binding:"required"`
}
