// @flow

class GeometryElement {
  x: number
  y: number

  constructor(x: number = 0, y: number = 0): void {
    if (this.constructor === GeometryElement) {
      throw new TypeError(
        'Abstract class "GeometryElement" cannot be instantiated directly.'
      )
    }
    this.x = x
    this.y = y
  }

  set(x: number, y: number): GeometryElement {
    this.x = x
    this.y = y
    return this
  }

  toInt(): GeometryElement {
    this.x = Math.round(this.x)
    this.y = Math.round(this.y)
    return this
  }

  toString(): string {
    return `{ x: ${this.x}, y: ${this.y} }`
  }

  toList(): number[] {
    return [this.x, this.y]
  }

  toVector(): Vector {
    return new Vector(this.x, this.y)
  }

  clone(): GeometryElement {
    return new this.constructor(this.x, this.y)
  }

  equal(other: GeometryElement): boolean {
    return (
      this === other ||
      (other && this.x === other.x && this.y === other.y) ||
      false
    )
  }

  add(other: GeometryElement): GeometryElement {
    return new this.constructor(this.x + other.x, this.y + other.y)
  }

  subtract(other: GeometryElement): GeometryElement {
    return new this.constructor(this.x - other.x, this.y - other.y)
  }

  scale(factorX: number, factorY?: number): GeometryElement {
    if (!factorY) {
      factorY = factorX
    }
    return new this.constructor(factorX * this.x, factorY * this.y)
  }

  unscale(factorX: number, factorY?: number): GeometryElement {
    if (factorX === 0 || factorY === 0) {
      return this.clone()
    }
    if (!factorY) {
      factorY = factorX
    }
    return new this.constructor(this.x / factorX, this.y / factorY)
  }

  translate(translateX: number, translateY?: number): GeometryElement {
    if (translateY === undefined) {
      translateY = translateX
    }
    return new this.constructor(this.x + translateX, this.y + translateY)
  }

  scaleToImage([
    translateX,
    translateY,
    scaleX,
    scaleY,
  ]: Array<number>): GeometryElement {
    const scaled: GeometryElement = new this.constructor(
      scaleX * this.x + translateX,
      scaleY * this.y + translateY
    )
    return scaled.toInt()
  }

  toRelative([
    translateX,
    translateY,
    scaleX,
    scaleY,
  ]: Array<number>): GeometryElement {
    return new this.constructor(
      (this.x - translateX) / scaleX,
      (this.y - translateY) / scaleY
    )
  }

  multiply(factorX: number, factorY?: number): GeometryElement {
    return this.scale(factorX, factorY)
  }

  divide(factorX: number, factorY?: number): GeometryElement {
    if (factorX === 0 || factorY === 0) {
      return this
    }
    if (!factorY) {
      factorY = factorX
    }
    return new this.constructor(this.x / factorX, this.y / factorY)
  }

  distance(other: GeometryElement = new this.constructor()): number {
    return Math.hypot(...this.subtract(other).toList())
  }

  squareNorm(): number {
    return this.x ** 2 + this.y ** 2
  }

  angle(other: GeometryElement): number {
    return Math.atan2(other.y, other.x) - Math.atan2(this.y, this.x)
  }

  rotate(theta: number): GeometryElement {
    return new this.constructor(
      Math.cos(theta) * this.x - Math.sin(theta) * this.y,
      Math.sin(theta) * this.x + Math.cos(theta) * this.y
    )
  }

  isNotBetween0and1(): boolean {
    return this.x < 0 || this.x > 1 || this.y < 0 || this.y > 1
  }

  sanitize(): GeometryElement {
    this.set(
      Number(Math.max(0, Math.min(this.x, 1)).toFixed(4)),
      Number(Math.max(0, Math.min(this.y, 1)).toFixed(4))
    )
    return this
  }
}

class Point extends GeometryElement {}

class Vector extends GeometryElement {
  crossProduct(other: GeometryElement): number {
    return this.x * other.y - this.y * other.x
  }

  scalarProduct(other: GeometryElement): number {
    return this.x * other.x + this.y * other.y
  }
}

const Segment = class {
  from: GeometryElement
  to: GeometryElement
  diff: GeometryElement
  vector: Vector

  constructor(
    from: GeometryElement = new Point(),
    to: GeometryElement = new Point()
  ) {
    this.from = from
    this.to = to
    this.diff = to.subtract(from)
    this.vector = this.diff.toVector()
  }

  intersects(other: Segment) {
    /**
     * See: http://stackoverflow.com/a/565282/786339
     */
    const fromVectorDiff = other.from.subtract(this.from).toVector()
    const uNumerator = fromVectorDiff.crossProduct(this.vector)
    const denominator = this.vector.crossProduct(other.vector)

    if (uNumerator === 0 && denominator === 0) {
      // collinear vectors

      const pointsCouple = [
        [other.from, this.from],
        [other.from, this.to],
        [other.to, this.from],
        [other.to, this.to],
      ]

      // Any points equal?
      if (pointsCouple.some(([p1, p2]) => p1.equal(p2))) {
        return true
      }
      // Do they overlap?
      // (Are all the point differences in either direction the same sign)
      const pointsDiff: GeometryElement[] = pointsCouple.map(([p1, p2]) =>
        p1.subtract(p2)
      )
      return !(
        pointsDiff
          .map((el) => el.x < 0)
          .every((val: boolean, _, arr: Array<boolean>) => val === arr[0]) &&
        pointsDiff
          .map((el) => el.y < 0)
          .every((val: boolean, _, arr: Array<boolean>) => val === arr[0])
      )
    }

    if (denominator === 0) {
      // parallel vectors
      return false
    }

    const u = uNumerator / denominator
    const t = fromVectorDiff.crossProduct(other.vector) / denominator
    // 0 <= t <= 1 and 0 <= u <= 1
    return t >= 0 && t <= 1 && u >= 0 && u <= 1
  }

  project(point: GeometryElement, scalingFactor: Array<number> = [1, 1]) {
    /**
     * Project a point on a line defined by:
     * point "from" and direction "vector"
     * We use:
     * Ps(point) = (point.s / s.s) s
     */
    const ss = this.vector.squareNorm()
    if (ss < Number.EPSILON) {
      return this.to
    }

    point = point.subtract(this.from)
    return this.diff
      .scale(point.toVector().scalarProduct(this.vector) / ss)
      .add(this.from)
      .unscale(...scalingFactor)
      .sanitize()
  }
}

type Extra = {
  text?: string,
  color?: string,
  other?: any,
}

type ExtraShape = $Shape<Extra>

class Polygon {
  points: Array<GeometryElement>
  isClosed: boolean
  isRectangle: boolean
  extra: ExtraShape
  constructor(
    points: Array<GeometryElement> = [],
    isClosed: boolean = true,
    isRectangle: boolean = false,
    extra: ExtraShape = {}
  ) {
    this.points = points
    this.isClosed = isClosed
    this.isRectangle = isRectangle
    this.extra = extra
  }

  get length() {
    return this.points.length
  }

  get width() {
    if (!this.isRectangle) {
      return this.getSurroundingRectangle()[2]
    }
    return this.points[1].distance(this.points[0])
  }

  get height() {
    if (!this.isRectangle) {
      return this.getSurroundingRectangle()[3]
    }
    return this.points[3].distance(this.points[0])
  }

  clone() {
    return new this.constructor(
      [...this.points.map((p) => p.clone())],
      this.isClosed,
      this.isRectangle,
      { ...this.extra }
    )
  }

  toString() {
    return `Polygon - points [${this.points.toString()}] - extra: ${JSON.stringify(
      this.extra
    )}`
  }

  toList(): Array<number>[] {
    return this.points.map((p) => p.toList())
  }

  translate(dx: number, dy: number) {
    const newPolygon = this.clone()
    newPolygon.points = newPolygon.points.map((p) => p.translate(dx, dy))
    return newPolygon
  }

  safeTranslate(dx: number, dy: number) {
    const newPolygon = this.clone()
    newPolygon.points = newPolygon.points.map((p) => p.translate(dx, dy))
    if (newPolygon.points.some((p) => p.isNotBetween0and1())) {
      return this.clone()
    }
    return newPolygon
  }

  scale(factorX: number, factorY?: number) {
    if (!factorY) {
      factorY = factorX
    }
    const newPolygon = this.clone()
    newPolygon.points = newPolygon.points.map((p) => p.scale(factorX, factorY))
    return newPolygon
  }

  unscale(factorX: number, factorY?: number) {
    if (factorX === 0 || factorY === 0) {
      return this
    }

    if (!factorY) {
      factorY = factorX
    }
    const newPolygon = this.clone()
    newPolygon.points = newPolygon.points.map((p) =>
      p.unscale(factorX, factorY)
    )
    return newPolygon
  }

  scaleToImage(imageBoundingBox: Array<number>) {
    const newPolygon = this.clone()
    newPolygon.points = newPolygon.points.map((p) =>
      p.scaleToImage(imageBoundingBox)
    )
    return newPolygon
  }

  toRelative(imageBoundingBox: Array<number>) {
    const newPolygon = this.clone()
    newPolygon.points = newPolygon.points.map((p) =>
      p.toRelative(imageBoundingBox)
    )
    return newPolygon
  }

  rotate(theta: number, scalingFactor: Array<number>) {
    /*
     * - translate the shape on the origin
     * - scale to image size
     * - rotate the shape
     * - unscale
     * - translate again all points to original center
     */
    let newPolygon = this.clone()
    const center = newPolygon.computeCenter()
    newPolygon = newPolygon
      .translate(...center.scale(-1).toList())
      .scale(...scalingFactor)

    newPolygon.points = newPolygon.points.map((el) => el.rotate(theta))
    newPolygon = newPolygon
      .unscale(...scalingFactor)
      .translate(...center.toList())

    if (newPolygon.points.some((point) => point.isNotBetween0and1())) {
      return this
    }

    newPolygon.sanitizePoints()
    return newPolygon
  }

  rotateToPoint(
    point: GeometryElement,
    pointIndex: number,
    scalingFactor: Array<number>
  ) {
    // angle between previousPoint, shape center and newPoint
    const center = this.computeCenter()
    const previousPoint = this.points[pointIndex].subtract(center)
    const theta = previousPoint.angle(point.subtract(center))
    return this.rotate(theta, scalingFactor)
  }

  add(point: GeometryElement) {
    const newPoly = this.clone()
    newPoly.points.push(point)
    return newPoly
  }

  remove(index: number) {
    const newPoly = this.clone()
    newPoly.length && newPoly.points.splice(index, 1)
    return newPoly
  }

  pop() {
    const newPoly = this.clone()
    newPoly.length && newPoly.points.pop()
    return newPoly
  }

  checkIfRectangle() {
    if (this.length !== 4) {
      this.isRectangle = false
      return this.isRectangle
    }

    const [a, b, c, d] = this.points
    const ab = b.subtract(a)
    const bc = c.subtract(b)
    const cd = d.subtract(c)
    const da = a.subtract(d)
    const ac = c.subtract(a)
    const bd = d.subtract(b)
    const allSegments = [ab, bc, cd, da, ac, bd]

    if (
      Math.abs(ac.squareNorm() - bd.squareNorm()) > Number.EPSILON ||
      allSegments
        .map((s) => s.squareNorm())
        .reduce((a, b: number) => a * b, 1) === 0
    ) {
      this.isRectangle = false
    } else {
      this.isRectangle =
        Math.abs(ab.toVector().scalarProduct(bc)) < Number.EPSILON &&
        Math.abs(bc.toVector().scalarProduct(cd)) < Number.EPSILON &&
        Math.abs(cd.toVector().scalarProduct(da)) < Number.EPSILON
    }
    return this.isRectangle
  }

  contains(point: GeometryElement): boolean {
    /**
     * Checks if the given point lay inside the given polygon
     *
     * We use ray casting, see https://en.wikipedia.org/wiki/Point_in_polygon
     */

    let points: GeometryElement[] = this.points.map((p) => p.clone())
    if (points.length < 3) {
      return false
    }

    // we take a ray from point to the right edge of the image (same ordinate)
    let intersection = 0

    const xCoordinates = points.map((el) => el.x)
    const yCoordinates = points.map((el) => el.y)

    const minX = Math.min(...xCoordinates)
    const maxX = Math.max(...xCoordinates)
    const minY = Math.min(...yCoordinates)
    const maxY = Math.max(...yCoordinates)

    if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
      return false
    }

    // Close the shape to iterate over all segments
    points.push(points[0])

    for (let ndx = 0; ndx < points.length - 1; ndx++) {
      const segment = new Segment(point, new Point(point.x + 2000, point.y))
      const other = new Segment(points[ndx], points[ndx + 1])
      if (segment.intersects(other)) {
        intersection++
      }
    }
    return Boolean(intersection % 2)
  }

  sanitizePoints() {
    // Ensure all coordinates are 0 < x < 1
    // And limit precision to 4
    this.points = this.points.map((p) => p.sanitize())
    return this
  }

  getSurroundingRectangle(): Array<number> {
    if (this.points.length < 3) {
      return []
    }
    const x = this.points.map((point) => point.x)
    const y = this.points.map((point) => point.y)

    const minX = Math.min(...x)
    const minY = Math.min(...y)
    const maxX = Math.max(...x)
    const maxY = Math.max(...y)

    return [minX, minY, maxX - minX, maxY - minY]
  }

  getClosestPointIndex(point: GeometryElement) {
    const pointsDistance = this.points.map((p) => p.distance(point))
    return pointsDistance.indexOf(Math.min(...pointsDistance))
  }

  getSelectedPointIndex(
    point: GeometryElement,
    proximityThreshold: number = 5
  ) {
    const index = this.points.findIndex(
      (p) => p.distance(point) < proximityThreshold
    )
    return index === -1 ? undefined : index
  }

  _checkIntersection(segment: Segment, startIndex: number = 0) {
    for (let index = startIndex; index < this.length - 2; index++) {
      const segment2 = new Segment(this.points[index], this.points[index + 1])
      if (segment2.intersects(segment)) {
        return true
      }
    }
    return false
  }

  intersects(segment: Segment, exclude: number) {
    // Check if segment intersects with polygon.
    // We exclude a point index which is the point being updated
    const points = this.points
    const pointsLen = this.length
    for (let index = 0; index < pointsLen; index++) {
      if (
        [
          (pointsLen + exclude - 1) % pointsLen,
          exclude,
          (exclude + 1) % pointsLen,
        ].indexOf(index) !== -1
      ) {
        continue
      }
      const segment2 = new Segment(
        points[index],
        points[(index + 1) % pointsLen]
      )
      if (segment2.intersects(segment)) {
        return true
      }
    }
    return false
  }

  intersectsWithNewLine(point: GeometryElement) {
    const potentialSegment = new Segment(this.points[this.length - 1], point)
    // When the polygon is not closed, we check if adding 'point'
    // creates intersection with previous lines
    return this._checkIntersection(potentialSegment)
  }

  intersectsItselfIfClosed() {
    const closingSegment = new Segment(
      this.points[0],
      this.points[this.length - 1]
    )
    return this._checkIntersection(closingSegment, 1)
  }

  canBeClosed() {
    return this.length > 2 && !this.intersectsItselfIfClosed()
  }

  intersectsItselfWithUpdatedPoint(point: GeometryElement, index: number) {
    const previousIndex = (index - 1 + this.length) % this.length
    const firstSegment = new Segment(this.points[previousIndex], point)
    const secondSegment = new Segment(
      point,
      this.points[(index + 1) % this.length]
    )
    return (
      this.intersects(firstSegment, previousIndex) ||
      this.intersects(secondSegment, index)
    )
  }

  computeCenter(): GeometryElement {
    /**
     * Here, we used the centroid. Warning: this approach could be wrong
     * if we want user interaction center
     * (see gravity center or accessibility center for more)
     *
     * It can be written as:
     *
     *     Σ xi / N
     *
     * - xi being the i-th point of our list of points
     * - N the number of points
     *
     */
    return this.points
      .reduce((p1, p2) => p1.add(p2), new Point())
      .divide(this.points.length)
      .sanitize()
  }

  computeGravityCenter(): GeometryElement {
    /**
     * Compute the center of gravity (area wise)
     * It can be written as:
     *
     *      Gx = (1/6A) Σ ( xi + x(i+1) ) * (xi.y(i+1) - x(i+1).yi)
     *      Gy = (1/6A) Σ ( yi + y(i+1) ) * (xi.y(i+1) - x(i+1).yi)
     *
     *      with A = (1/2) Σ ( xi.y(i+1) - x(i+1).yi )
     *
     * - (xi, yi) being the coordinates of i-th point.
     *
     * For more, see http://math.15873.pagesperso-orange.fr/page9.htm
     */
    const crossProducts: number[] = this.points.map((p1, index) =>
      p1.toVector().crossProduct(this.points[(index + 1) % this.length])
    )
    return this.points
      .map((p1: GeometryElement, index) =>
        p1
          .add(this.points[(index + 1) % this.length])
          .multiply(crossProducts[index])
      )
      .reduce(
        (p1: GeometryElement, p2: GeometryElement) => p1.add(p2),
        new Point()
      )
      .divide(3 * crossProducts.reduce((a, b) => a + b, 0))
      .sanitize()
  }

  makeRectangle(point: GeometryElement = new Point()) {
    if (this.points.length === 0 || this.points.length > 4) {
      return this
    }

    const firstPoint = this.points[0]

    const diffX = point.subtract(firstPoint).x
    this.points = [
      firstPoint,
      new Point(firstPoint.x + diffX, firstPoint.y),
      point,
      new Point(point.x - diffX, point.y),
    ]
    this.isClosed = true
    this.isRectangle = true
    this.normalizeRectangle()
    return this
  }

  normalizeRectangle() {
    // Return rectangle points "clockwise"
    const ab = this.points[1].subtract(this.points[0])
    const bc = this.points[2].subtract(this.points[1])
    if (ab.toVector().crossProduct(bc) > 0) {
      this.points.reverse()
    }

    this.sanitizePoints()
    return this
  }

  resizeRectangle(
    point: GeometryElement,
    selectedIndex: number,
    scalingFactor: Array<number> = [1, 1]
  ) {
    let newPolygon = this.scale(...scalingFactor)
    const oppositePointIndex = (selectedIndex + 2) % 4
    const previousPointIndex = (selectedIndex + 1) % 4
    const nextPointIndex = (selectedIndex + 3) % 4
    const oppositePoint = newPolygon.points[oppositePointIndex]
    const previousPoint = newPolygon.points[previousPointIndex]
    const nextPoint = newPolygon.points[nextPointIndex]
    point = point.scale(...scalingFactor)

    const line1 = new Segment(oppositePoint, nextPoint)
    const point2 = line1.project(point, scalingFactor)

    const line2 = new Segment(oppositePoint, previousPoint)
    const point4 = line2.project(point, scalingFactor)

    let updatedPoints = []
    updatedPoints[selectedIndex] = point.unscale(...scalingFactor)
    updatedPoints[oppositePointIndex] = oppositePoint.unscale(...scalingFactor)
    updatedPoints[previousPointIndex] = point4
    updatedPoints[nextPointIndex] = point2

    if (
      updatedPoints.some((point: GeometryElement) => point.isNotBetween0and1())
    ) {
      return this
    }

    newPolygon.points = updatedPoints
    if (newPolygon.width < 1e-4 || newPolygon.height < 1e-4) {
      return this
    }
    newPolygon.normalizeRectangle()
    return newPolygon
  }

  toInt(): GeometryElement[] {
    return this.points.map((point) => point.toInt())
  }

  getTextPosition(
    width: number,
    height: number,
    imageBoundingBox: Array<number>
  ): GeometryElement {
    /**
     * Display text on the middle of the shape,
     * Eventually apply an offset to center text
     */

    const center = this.computeCenter().scaleToImage(imageBoundingBox)
    const halfTextSize = new Point(width / 2, -height / 2).toInt()
    if (center.x - halfTextSize.x < 0 || center.y - halfTextSize.y < 0) {
      return center
    } else {
      return center.subtract(halfTextSize)
    }
  }
}

const createPolygonFromCoordinates = (coordinates: Array<Array<number>>) => {
  const points = coordinates.map((el) => new Point(...el))
  return new Polygon(points)
}

export {
  GeometryElement,
  Point,
  Polygon,
  Segment,
  Vector,
  createPolygonFromCoordinates,
}
