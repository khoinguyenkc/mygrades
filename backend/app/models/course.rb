class Course < ApplicationRecord
    has_many :categories

    def grade_percentage
        percentages = []
        cats = self.categories
        #loop thru cats, and in there, loop thru assignments, 
        cats.each do   |cat| 
            cat_score_sum = 0;
            cat_out_of_sum = 0;
            cat.assignments.each do | assignment | 
                cat_score_sum += assignment.score
                cat_out_of_sum += assignment.out_of
            end
            percentage = cat.weight * (cat_score_sum / cat_out_of_sum)
            percentages.push(percentage)
        end

        return percentages.sum
    end


    





end
