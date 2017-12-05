class Render{
    constructor(callback, fps) {
        let self = this;
        this.lastTime = null;
        this.callback = callback;
        this.isActive = false;
        this.fps = 0;

        if(typeof(fps) === 'number' && fps > 0) {
            this.frameTimeLimit = 1 / fps;

            this.run = function() {
                let currentTime = performance.now();
                let timespan = (currentTime - self.lastTime) / 1000;
                
                if(timespan >= self.frameTimeLimit){
                    self.fps = Math.floor(1 / timespan);
                    self.lastTime = currentTime;
                    self.callback(timespan)
                }

                if(self.isActive) { window.requestAnimationFrame(self.run); }
            }
        } else {
            this.run = function() {
                let currentTime = performance.now();
                let timespan = (currentTime - self.lastTime) / 1000;

                self.fps = Math.floor(1 / timespan);
                self.lastTime = currentTime;

                self.callback(timespan);
                if(self.isActive) { window.requestAnimationFrame(self.run); }
            }
        }
    }

    start() {
        this.isActive = true;
        this.lastTime = performance.now();
        window.requestAnimationFrame(this.run);
        return this;
    }

    stop() { this.isActive = false; }
}
