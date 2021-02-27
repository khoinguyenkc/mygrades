class CourseSerializer

    def initialize(course_object)
        @course = course_object
    end

    def to_serialized_json
        @course.to_json(:include => { 
            :categories => {:only => [:id, :name], :include => [:assignments]}
        }, :except => [:updated_at, :created_at])


    end


end
