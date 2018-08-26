import { Component } from 'czpg-ecs';
import { Transform, Hierarchy } from '../components';

class Register extends Component {

    static get map() {

        return Component.getInjectedComponents();

    }

    static get size() {

        return Register.map.size;

    }

}

Register.inject( Transform );
Register.inject( Hierarchy );

export { Register };
