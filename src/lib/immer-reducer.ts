/**
 * Source: https://github.com/esamattis/immer-reducer
 * Copied to avoid dependency on a library that is not maintained
 */

import { Fn } from "$root/types";
import produce, { Draft } from "immer";

/** get function arguments as tuple type */
type ArgumentsType<T> = T extends (...args: infer V) => any ? V : never;

/**
 * Get the first value of tuple when the tuple length is 1 otherwise return the
 * whole tuple
 */
type FirstOrAll<T> = T extends [infer V] ? V : T;

/** Get union of function property names */
type FunctionPropertyNames<T> = {
	[K in keyof T]: T[K] extends Fn<any[], any> ? K : never;
}[keyof T];

type MethodObject = { [key: string]: () => any };

/** Pick only methods from object */
type Methods<T> = Pick<T, FunctionPropertyNames<T>>;

/** flatten functions in an object to their return values */
type FlattenToReturnTypes<T extends MethodObject> = {
	[K in keyof T]: ReturnType<T[K]>;
};

/** get union of object value types */
type ObjectValueTypes<T> = T[keyof T];

/** get union of object method return types */
type ReturnTypeUnion<T extends MethodObject> = ObjectValueTypes<
	FlattenToReturnTypes<T>
>;

/**
 * Get union of actions types from a ImmerReducer class
 */
type Actions<T extends ImmerReducerClass> = ReturnTypeUnion<ActionCreators<T>>;

/** type constraint for the ImmerReducer class  */
interface ImmerReducerClass {
	customName?: string;
	new (...args: any[]): ImmerReducer<any>;
}

/** get state type from a ImmerReducer subclass */
type ImmerReducerState<T> = T extends {
	prototype: {
		state: infer V;
	};
}
	? V
	: never;

/** generate reducer function type from the ImmerReducer class */
interface ImmerReducerFunction<T extends ImmerReducerClass> {
	(
		state: ImmerReducerState<T>,
		action: ReturnTypeUnion<ActionCreators<T>>
	): ImmerReducerState<T>;
}

/** ActionCreator function interface with actual action type name */
interface ImmerActionCreator<ActionTypeType, Payload extends any[]> {
	readonly type: ActionTypeType;

	(...args: Payload): Payload extends []
		? {
				// Leave out payload if it is empty
				type: ActionTypeType;
		  }
		: {
				type: ActionTypeType;
				payload: FirstOrAll<Payload>;
		  };
}

/** generate ActionCreators types from the ImmerReducer class */
type ActionCreators<ClassActions extends ImmerReducerClass> = {
	[K in keyof Methods<InstanceType<ClassActions>>]: ImmerActionCreator<
		K,
		ArgumentsType<InstanceType<ClassActions>[K]>
	>;
};

/**
 * Internal type for the action
 */
type ImmerAction =
	| {
			type: string;
			payload: unknown;
			args?: false;
	  }
	| {
			type: string;
			payload: unknown[];
			args: true;
	  };

function isActionFromClass<T extends ImmerReducerClass>(
	action: { type: any },
	immerReducerClass: T
): action is Actions<T> {
	if (typeof action.type !== "string") {
		return false;
	}

	if (typeof immerReducerClass.prototype[action.type] !== "function") {
		return false;
	}

	return true;
}

/** The actual ImmerReducer class */
export class ImmerReducer<T> {
	static customName?: string;
	readonly state: T;
	draftState: Draft<T>; // Make read only states mutable using Draft

	constructor(draftState: Draft<T>, state: T) {
		this.state = state;
		this.draftState = draftState;
	}
}

/**
 * Convert function arguments to ImmerAction object
 */
function createImmerAction(type: string, args: unknown[]): ImmerAction {
	if (args.length === 1) {
		return { type, payload: args[0] };
	}

	return {
		type,
		payload: args,
		args: true,
	};
}

/**
 * Get function arguments from the ImmerAction object
 */
function getArgsFromImmerAction(action: ImmerAction): unknown[] {
	if (action.args) {
		return action.payload;
	}

	return [action.payload];
}

function getAllPropertyNames(obj: object) {
	const proto = Object.getPrototypeOf(obj);
	const inherited: string[] = proto ? getAllPropertyNames(proto) : [];
	return Object.getOwnPropertyNames(obj)
		.concat(inherited)
		.filter(
			(propertyName, index, uniqueList) =>
				uniqueList.indexOf(propertyName) === index
		);
}

export function createActionCreators<T extends ImmerReducerClass>(
	immerReducerClass: T
): ActionCreators<T> {
	const actionCreators: { [key: string]: Fn<any[], any> } = {};

	const immerReducerProperties = getAllPropertyNames(ImmerReducer.prototype);
	getAllPropertyNames(immerReducerClass.prototype).forEach((key) => {
		if (immerReducerProperties.includes(key)) {
			return;
		}
		const method = immerReducerClass.prototype[key];

		if (typeof method !== "function") {
			return;
		}

		const actionCreator = (...args: any[]) => {
			// Make sure only the arguments are passed to the action object that
			// are defined in the method
			return createImmerAction(key, args.slice(0, method.length));
		};
		actionCreator.type = key;
		actionCreators[key] = actionCreator;
	});

	return actionCreators as any; // typed in the function signature
}

export function createReducerFunction<T extends ImmerReducerClass>(
	immerReducerClass: T
): ImmerReducerFunction<T> {
	return function immerReducerFunction(state, action) {
		if (!isActionFromClass(action, immerReducerClass)) {
			return state;
		}

		return produce(state, (draftState) => {
			const reducers: any = new immerReducerClass(draftState, state);

			reducers[action.type](...getArgsFromImmerAction(action as any));

			// The reducer replaced the instance with completely new state so
			// make that to be the next state
			if (reducers.draftState !== draftState) {
				return reducers.draftState;
			}

			// Workaround typing changes in Immer 9.x. This does not actually
			// affect the exposed types by immer-reducer itself.

			// Also using immer internally with anys like this allow us to
			// support multiple versions of immer.
		});
	};
}
