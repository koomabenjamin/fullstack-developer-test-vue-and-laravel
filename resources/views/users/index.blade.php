@extends('layouts.app')

@section('content')

<div class="container with-background">
    <div class="row">
        <div class="col-sm-4 col-md-4 col-lg-4">
            <h2>Users</h2>
        </div>
        <div class="col-sm-5 col-md-5 col-lg-5">
            @csrf
            
            <div class="row">
                <div class="col-sm-8 col-md-8 col-lg-8">
                    <input type="text" class="form-control" id="search_field" name="search_field" placeholder="E.g Ronald">
                </div>
                <div class="col-sm-2 col-md-2 col-lg-2">
                    <button type="submit" class="btn btn-primary" id="search">Search</button>
                </div>
                <div class="col-sm-2 col-md-2 col-lg-2">
                    <button type="submit" class="btn btn-secondary" id="clear">Clear</button>
                </div>
            </div>
        </div>
        <div class="col-sm-3 col-md-3 col-lg-3 text-right">
            <a href="users/create" class="btn btn-primary">Add User</a>
        </div>
    </div>
    @if(Session::has('success'))
    <div class="alert alert-success">
        {{ Session::get('success') }}
        @php
            Session::forget('success');
        @endphp
    </div>
    @endif

    <div class="py-4 table-responsive">
        <table class="table table-striped">
            <thead class="thead-dark">
                <tr>
                    <th>#</th>
                    <th scope="col" class="col-sm-4 col-md-4 col-lg-4">Name</th>
                    <th scope="col" class="col-sm-2 col-md-2 col-lg-2">Email</th>
                    <th scope="col" class="col-sm-2 col-md-2 col-lg-2">Time Created</th>
                    <th scope="col" class="col-sm-2 col-md-2 col-lg-2">Actions</th>
                </tr>
            </thead>
            
            <tbody>
                @if ($users->count() == 0)
                   <tr>
                       <td colspan="6" class="text-danger text-center"><strong>No Users to display</strong></td>
                   </tr> 
               @endif
            @foreach ($users as $user)
                <tr>
                    <td>{{ $loop->iteration }}.</td>
                    <td>{{ $user->name }}</td>
                    <td><a href="mailto:{{ $user->email }}">{{  $user->email  }}</a></td>
                    <td>{{ date('d/m/Y H:i:s', strtotime($user->created_at)) }}</td>
                    <td class="row">
                        <a href="users/{{ $user->id }}/edit" class="btn btn-success mr-2">Edit</a>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
    <div class="d-flex justify-content-center">
        {!! $users->links() !!}
    </div>
    </div>
</div>

<script type="text/javascript">
    function filterResults () {
        let search_field = document.getElementById("search_field");
        let href = '/users';

        if(search_field.value !== '') {
            href += '?search=' + search_field.value;
        }

        document.location.href=href;
    }

    document.getElementById("search").addEventListener("click", filterResults);
    document.getElementById("clear").addEventListener("click", filterResults);
</script>

@endsection