export const resetBodyPosition = (body) => {
    // Position
body.position.setZero();
body.previousPosition.setZero();
body.interpolatedPosition.setZero();
body.initPosition.setZero();

// orientaftion
body.quaternion.set(0,0,0,1);
body.initQuaternion.set(0,0,0,1);
body.previousQuaternion.set(0,0,0,1);
body.interpolatedQuaternion.set(0,0,0,1);

// Velocity
body.velocity.setZero();
body.initVelocity.setZero();
body.angularVelocity.setZero();
body.initAngularVelocity.setZero();

// Force
body.force.setZero();
body.torque.setZero();

// Sleep state reseta
body.sleepState = 0;
body.timeLastSleepy = 0;
body._wakeUpAfterNarrowphase = false;
}