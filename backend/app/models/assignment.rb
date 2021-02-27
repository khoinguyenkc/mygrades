class Assignment < ApplicationRecord
    belongs_to :category, optional: true
end
