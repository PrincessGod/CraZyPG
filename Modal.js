class Modal{
    constructor(mesh){
        this.mesh = mesh;
        this.transform = new Transform();
    }

    setScale(x, y, z) {
        this.transform.scale.set(x, y, z);
        return this;
    }

    setPosition(x, y, z) {
        this.transform.position.set(x, y, z);
        return this;
    }

    setRotation(x, y, z) {
        this.transform.rotation.set(x, y, z);
        return this;
    }

    addScale(x, y, z) {
        this.transform.scale.x += x;
        this.transform.scale.y += y;
        this.transform.scale.z += z;
        return this;
    }

    addPosition(x, y, z) {
        this.transform.position.x += x;
        this.transform.position.y += y;
        this.transform.position.z += z;
        return this;
    }

    addRotation(x, y, z) {
        this.transform.rotation.x += x;
        this.transform.rotation.y += y;
        this.transform.rotation.z += z;
        return this;
    }

    preRender() {
        this.transform.updateMatrix();
        return this;
    }
}
