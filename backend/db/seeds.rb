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

englishessays = Category.create(name: "english essays", weight: 0.70, course: englishclass)
getty = Assignment.create(name: "gettysburg address analysis", score: 87, out_of: 100, category: englishessays)
amuse = Assignment.create(name: "amuse ourselves to death critique", score: 92, out_of: 100, category: englishessays)
gatsby = Assignment.create(name: "great gatsby analysis", score: 94, out_of: 100, category: englishessays)

reading = Category.create(name: "reading", weight: 0.30, course: englishclass)
read1 = Assignment.create(name: "reading 1", score: 10, out_of: 10, category: reading)
read2 = Assignment.create(name: "reading 1", score: 8, out_of: 10, category: reading)
