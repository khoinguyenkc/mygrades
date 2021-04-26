class CoursesController < ApplicationController
    def create 
        course = Course.create(course_params) if !params[:name].empty?
        render json: CourseSerializer.new(course).to_serialized_json

    end

    def show
    #later will check user 

        course = Course.find_by(id: params[:id])
        # binding.pry
            # render json: course, only: [:id, :name], include: [:categories]
            render json: CourseSerializer.new(course).to_serialized_json
    end

    def index
        #later will only get courses of that user
        courses = Course.all
            render json: courses, only: [:id, :name]

    end


    def update
    end

    def delete
    end

    private
    def course_params
        params.require(:course).permit(:id, :name, :category_ids => [])
        #need id or it say invalid sql and lock database..
    end

end
