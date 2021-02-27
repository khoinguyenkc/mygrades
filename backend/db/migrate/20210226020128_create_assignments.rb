class CreateAssignments < ActiveRecord::Migration[6.0]
  def change
    create_table :assignments do |t|
      t.string :name
      t.decimal :score, :precision => 10, :scale => 2
      t.decimal :out_of, :precision => 10, :scale => 2
      t.references :category, null: false, foreign_key: true;
    end
  end
end
