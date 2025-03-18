import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  id: yup.string().required("Id is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

type FormValues = {
  id: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    console.log("Validated Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-md mx-auto border rounded-lg shadow-lg">
      <div>
        <label className="block font-bold">ID</label>
        <input {...register("id")} className="w-full p-2 border rounded" />
        {errors.id && <p className="text-red-500">{errors.id.message}</p>}
      </div>

      <div>
        <label className="block font-bold">Password</label>
        <input type="password" {...register("password")} className="w-full p-2 border rounded" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>

      <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Sign Up</button>
    </form>
  );
}
