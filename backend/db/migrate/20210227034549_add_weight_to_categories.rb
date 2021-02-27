class AddWeightToCategories < ActiveRecord::Migration[6.0]
  def change
    add_column :categories, :weight, :decimal, :precision => 10, :scale => 2
  end
end
