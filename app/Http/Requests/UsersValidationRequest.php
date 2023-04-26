<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UsersValidationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'email',
            'name' => 'required',
            'password' => 'required'
        ];
    }
}
