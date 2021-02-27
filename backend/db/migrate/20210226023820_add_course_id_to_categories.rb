class AddCourseIdToCategories < ActiveRecord::Migration[6.0]
  def change
    add_reference :categories, :course, index: true
    add_foreign_key :categories, :courses
  end
end
