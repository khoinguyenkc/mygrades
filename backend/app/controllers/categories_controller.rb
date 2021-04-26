class CategoriesController < ApplicationController
    def create 
        category = Category.create(category_params) if (!params[:name].empty? && !params[:weight].empty?)
        message =  {message: "category created" }
        render json: message
    end

    def show
    end
    
    def index
    end
    
    
    def update
    end
    
    def delete
    end

    private
    def category_params
        params.require(:category).permit(:id, :name, :weight, :course_id)
        #need id or it say invalid sql and lock database..
    end

end

