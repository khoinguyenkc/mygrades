class CoursesController < ApplicationController
    def create 
    end

    def show
    #later will check user 

        course = Course.find_by(id: params[:id])
        # binding.pry
            render json: course, only: [:id, :name], include: [:categories]
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
end
