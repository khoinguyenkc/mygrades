class AssignmentsController < ApplicationController
    def create 
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
        # => <ActionController::Parameters {
        # "id"=>"1",
        #  "name"=>"hahahgettysburg address analysis",
        #   "score"=>"187.0", 
        #   "out_of"=>"200.0", 
        #   "controller"=>"assignments", 
        #   "action"=>"update",
        #    "assignment"=>{"id"=>"1", "name"=>"hahahgettysburg address analysis", "score"=>"187.0", "out_of"=>"200.0"}} permitted: false>

        assignment = Assignment.find_by(id: params[:id])
        assignment.update(assignment_params)
        assignment.save
        binding.pry

        render json: assignment

    end

    def delete
    end

    private
    def assignment_params
        params.require(:assignment).permit(:id, :name, :score, :out_of)
    end

end
