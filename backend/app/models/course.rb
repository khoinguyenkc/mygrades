class Course < ApplicationRecord
    has_many :categories

    def calculate_grade
        percentages = []
        cats = self.categories
        #loop thru cats, and in there, loop thru assignments, 
        cats.each do   |cat| {
            cat_score_sum = 0;
            cat_out_of_sum = 0;
            cat.each do | assignment | {
                #add score
                #add dsum
            } 
            percentage = cat.weight * (cat_score_sum / cat_out_of_sum)
            percentages.push(percentage)
        }
    end

end
