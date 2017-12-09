class Transform{
    constructor() {
        this.position = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);
        this.rotation = new Vector3(0, 0, 0);
        this.matLocal = new Matrix4();
        this.matNormal = new Matrix4();

        this.forward = new Float32Array(4);
        this.up = new Float32Array(4);
        this.right = new Float32Array(4);
    }

    updateMatrix() {
        this.matLocal.reset()
            .vtranslate(this.position)
            .rotateZ(this.rotation.z * Transform.deg2Rad)
            .rotateX(this.rotation.x * Transform.deg2Rad)
            .rotateY(this.rotation.y * Transform.deg2Rad)
            .vscale(this.scale);

        Matrix4.normalMat3(this.matNormal, this.matLocal.raw);

        Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matLocal.raw);
        Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matLocal.raw);
        Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matLocal.raw);

        return this.matLocal.raw;
    }

    updateDirection() {
        Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matLocal.raw);
        Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matLocal.raw);
        Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matLocal.raw);
        return this;
    }

    getMatrix() {
        return this.matLocal.raw;
    }

    getNormalMatrix() {
        return this.matNormal;
    }

    reset() {
        this.position.set(0, 0, 0);
        this.scale.set(1, 1, 1);
        this.rotation.set(0, 0, 0);
    }
}

Transform.deg2Rad = Math.PI / 180;
