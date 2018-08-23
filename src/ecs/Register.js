import { Component } from 'czpg-ecs';
import { Transform, Hierarchy } from '../components';

class Register extends Component {}

Register.inject( Transform );
Register.inject( Hierarchy );

export { Register };
