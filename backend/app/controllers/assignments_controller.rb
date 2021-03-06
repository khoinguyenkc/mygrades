class AssignmentsController < ApplicationController
    def create 
        assignment = Assignment.create(assignment_params) if !params[:name].empty?
        message = {message: "we received your new assignment"}
        render json: message
    end

    def show
    #later will check user 

    assignment = Assignment.find_by(id: params[:id])

            render json: assignment
    end

    def index
        #later will only get courses of that user
        courses = Course.all
            render json: courses, only: [:id, :name]

    end


    def update

        assignment = Assignment.find_by(id: params[:id])
        assignment.update(assignment_params)  if !params[:name].empty?
        assignment.save

        render json: assignment

    end

    def destroy
        assignment = Assignment.find_by(id: params[:id])
        assignment.delete

        message = {message: "we received your new assignment"}
        render json: message

    end

    private
    def assignment_params
        params.require(:assignment).permit(:id, :name, :score, :out_of, :category_id)
        #need id or it say invalid sql and lock database..
    end

end
