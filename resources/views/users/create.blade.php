@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">{{ __('Add User') }}</div>

                <div class="px-4">
                    <form action="/users" method="POST">
                        @csrf

                        <div class="row form-group">
                            <div class="col">
                                <label for="name">User Name</label>
                                <input type="text" class="form-control" id="name" name="name" placeholder="Customer Name">
                                @if ($errors->has('name'))
                                    <strong class="text-danger">{{ $errors->first('name') }}</strong>
                                @endif
                            </div>
                            <div class="col">
                                <label for="exampleInputEmail1">User Email address</label>
                                <input type="email" class="form-control" id="exampleInputEmail1" name="email" aria-describedby="emailHelp" placeholder="Enter email">
                                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                                @if ($errors->has('email'))
                                    <strong class="text-danger">{{ $errors->first('email') }}</strong>
                                @endif
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col">
                                <label for="password">{{ __('Password') }}</label>
                                    <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">
                                    @error('password')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                            </div>
                            <div class="col">
                                <label for="password-confirm">{{ __('Confirm Password') }}</label>
                                <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="level_id">School Level</label>
                            <select class="form-control" name="level_id">
                                <option value="">--- Select Level ---</option>
                                @foreach ($levels as $level )
                                    <option value="{{ $level->id }}">{{ $level->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="role_id">Role</label>
                            <select class="form-control" name="role_id">
                                <option value="">--- Select Role ---</option>
                                @foreach ($roles as $role )
                                    <option value="{{ $role->id }}">{{ $role->name }}</option>
                                @endforeach
                            </select>
                            @if ($errors->has('role_id'))
                                <strong class="text-danger">{{ $errors->first('role_id') }}</strong>
                            @endif
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary btn-lg">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection