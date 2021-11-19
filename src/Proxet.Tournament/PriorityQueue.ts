/**
 * Compares two values and returns true if values match the condition
 *
 * In the case of PriorityQueue it will determine heap property and
 * return false if the property is violated
 */
export type CompareFunc<T> = (left: T, right: T) => boolean;

export interface PriorityQueueParams<T> {
  compare: CompareFunc<T>,
  elements?: Array<T>,
}

/**
 * I'd like to use private properties and methods
 * but in tsconfig target is set as es5 but not es6
 * so I decided not to change it
 */

/**
 * Class that represents priority queue
 *
 * Elements in it sorted by property that is set
 * in constructor as a compare func
 *
 * Implemented as a binary heap
 */
export class PriorityQueue<T> {
  _compare: CompareFunc<T>;
  _elements: Array<T>;

  get length() : number {
    return this._elements.length;
  }

  get isEmpty() : boolean {
    return !this.length;
  }

  constructor({ compare, elements = [] } : PriorityQueueParams<T>) {
    this._compare = compare;
    this._elements = [];

    for (const el of elements) {
      this.push(el);
    }
  }

  push(element: T) : void {
    let current = this._elements.push(element) - 1;

    while (current > 0) {
      const parent = this._getParentIndex(current) as number;

      // If queue meets heap property
      if (this._compare(this._elements[parent], this._elements[current])) {
        break;
      }

      this._swap(parent, current);
      current = parent;
    }
  }


  front() : T {
    this._throwOnEmpty();

    return this._elements[0];
  }

  pop() : T {
    this._throwOnEmpty();

    this._swap(0, this.length - 1);
    const ret = this._elements.pop() as T;

    this._heapify(0);

    return ret;
  }


  _getParentIndex(idx: number) : number | null {
    if (idx <= 0) return null;
    return Math.floor((idx - 1) / 2);
  }

  _getLeftChildIndex(idx: number) : number | null {
    const childIdx = (idx * 2) + 1;
    if (childIdx >= this.length) return null;

    return childIdx;
  }

  _getRightChildIndex(idx: number) : number | null {
    const childIdx = (idx * 2) + 2;
    if (childIdx >= this.length) return null;

    return childIdx;
  }


  /**
   * Changes the heap so the heap property is kept
   * Assumes that left and right subtrees are valid heaps
   */
  _heapify(current: number) : void {
    while (true) {
      const left = this._getLeftChildIndex(current);
      const right = this._getRightChildIndex(current);

      let largest = current;

      if (left !== null) {
        if (!this._compare(this._elements[largest], this._elements[left])) {
          largest = left;
        }
      }

      if (right !== null) {
        if (!this._compare(this._elements[largest], this._elements[right])) {
          largest = right;
        }
      }

      if (largest === current) break;

      this._swap(largest, current);
      current = largest;
    }
  }


  _throwOnEmpty() : void {
    if (this.isEmpty) throw new Error("The PriorityQueue is empty");
  }

  _swap(first: number, second: number) : void {
    [
      this._elements[first],
      this._elements[second]
    ] = [
      this._elements[second],
      this._elements[first]
    ];
  }
}
