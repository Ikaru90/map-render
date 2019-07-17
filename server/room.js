const Room = function(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.interesect = function(room) {
    return !(room.x >= (this.x + width) || this.x >= (room.x + room.width)
      || room.y >= (this.y + height) || this.y >= (room.y + room.height));
  };
};

module.exports = Room;
