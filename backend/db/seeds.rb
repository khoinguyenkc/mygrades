# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Assignment.delete_all
Category.delete_all
Course.delete_all

englishclass = Course.create(name: "English")
calculusclass = Course.create(name: "Calculus")

englishessays = Category.create(name: "english essays", course: englishclass)
getty = Assignment.create(name: "gettysburg address analysis", score: 87, out_of: 100, category: englishessays)