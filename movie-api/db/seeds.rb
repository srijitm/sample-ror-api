# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Movie.destroy_all

Movie.create([
    { title: 'Star Wars', year: 1977, genre: 'SCI-FI'}, 
    { title: 'Lord of the Rings', year: 2001, genre: 'Fantasy' },
    {title: 'Matrix Resurrection', year: 2022, genre: "SCI-FI"}
])

p "Created #{Movie.count} movies"
